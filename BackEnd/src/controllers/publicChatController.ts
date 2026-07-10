import { Request, Response } from "express";
import PublicMessage from "../models/publicMessage.js";
import { io, onlineUsers } from "../app.js";
import Notification, { INotification } from "../models/notification.js";
import { userExcludedFields } from "../constants/index.js";
import { redisClient } from "../lib/redis.js";
import { Types } from "mongoose";

export const getAllPublicMessages = async (req: Request, res: Response) => {
  const pageParam = Number(req.query.pageParam) || 1;
  const limit = Number(req.query.limit) || 15;
  const skip = (pageParam - 1) * limit;

  try {
    const messages = await PublicMessage.find({})
      .sort({ createdAt: "descending" })
      .skip(skip)
      .limit(limit)
      .populate([
        { path: "sender", select: userExcludedFields },
        { path: "mentionedUsers", select: userExcludedFields },
        { path: "newUserReferred", select: userExcludedFields },
      ]);

    const hasMore = limit === messages.length;

    const reversed = messages.reverse();
    return res.status(200).json({ messages: reversed, hasMore });
  } catch (error) {
    return res.status(404).json({ error: "can't Load public chat" });
  }
};

export const createPublicMessage = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { messageText, type, mentionedUsers } = req.body;
  try {
    const newMessage = await PublicMessage.create({
      sender: req.user._id,
      message: messageText,
      mentionedUsers: mentionedUsers,
      type,
    });

    const populatedMessage = await PublicMessage.findById(newMessage._id).populate([
      { path: "sender", select: userExcludedFields },
      { path: "mentionedUsers", select: userExcludedFields },
      { path: "newUserReferred", select: userExcludedFields },
    ]);

    if (!populatedMessage) return res.status(401).json({ error: "an error occurred" });

    if (mentionedUsers.length > 0) {
      const newNotifications: INotification[] = [];
      mentionedUsers.forEach((userId: Types.ObjectId) => {
        const newNotification = new Notification({
          type: "MENTION",
          belongsTo: userId,
          metadata: {
            mentionedUser: req.user?._id,
            messageLocation: populatedMessage._id,
          },
        });
        newNotifications.push(newNotification);
      });

      const saveNotifications = await Notification.insertMany(newNotifications);

      const cacheKeys = mentionedUsers.map(
        (userId: Types.ObjectId) => `notifications:list:${userId.toString()}`,
      );

      await redisClient.del(cacheKeys);

      const ids = saveNotifications.map((item) => item._id);

      const populatedNotifications = await Notification.find({ _id: { $in: ids } }).populate(
        "metadata.mentionedUser",
        userExcludedFields,
      );
      populatedNotifications.forEach((notify) => {
        const targetSockets = onlineUsers.get(notify.belongsTo.toString());
        if (targetSockets) {
          io.to([...targetSockets]).emit("notification", notify);
        }
      });
    }
    const currentUserSockets = onlineUsers.get(req.user._id.toString());
    io.except(currentUserSockets ? [...currentUserSockets] : []).emit(
      "public_chat_message",
      populatedMessage,
    );

    return res.status(200).json(populatedMessage);
  } catch (error) {
    return res.status(404).json({ error: "can't send your message, an Error occurred" });
  }
};

export const getSingleMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  try {
    const cacheKey = `publicMessages:list:${messageId}`;
    const cachedPublicMessage = await redisClient.get(cacheKey);

    if (cachedPublicMessage) {
      return res.status(200).json(JSON.parse(cachedPublicMessage));
    }

    const message = await PublicMessage.findById(messageId).populate([
      { path: "sender", select: userExcludedFields },
      { path: "mentionedUsers", select: userExcludedFields },
    ]);

    if (!message) return res.status(404).json({ error: "Message Not Found" });

    await redisClient.set(cacheKey, JSON.stringify(message));

    return res.status(200).json(message);
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred, Try again" });
  }
};

export const deletePublicMessage = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { messageId } = req.params;
  try {
    const deletedMessage = await PublicMessage.findOneAndUpdate(
      { _id: messageId, sender: req.user._id },
      {
        isDeleted: true,
      },
      { returnDocument: "after" },
    )
      .populate("sender", userExcludedFields)
      .select("-message")
      .lean();

    await redisClient.del(`publicMessages:list:${messageId}`);

    if (deletedMessage) io.emit("public_chat_message_reaction", deletedMessage);
    return res.status(200).json(deletedMessage);
  } catch (error) {
    return res.status(404).json({ error: "can't delete message" });
  }
};

export const reactToPublicMessage = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  type TypeFieldName = "loves" | "dislikes" | "likes";
  const { fieldName, messageId } = req.params as {
    fieldName: TypeFieldName;
    messageId: string;
  };
  const allField = ["loves", "likes", "dislikes"];
  const getOtherTwoFields = allField.filter((item) => item !== fieldName);

  try {
    const message = await PublicMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({
        error: "Message Not Found",
      });
    }

    if (message[fieldName].includes(req.user._id)) {
      const index = message[fieldName].indexOf(req.user._id);
      message[fieldName].splice(index, 1);
    } else {
      message[fieldName].push(req.user._id);
      const interactedWithMessageBefore = await Notification.findOne({
        belongsTo: message.sender._id,
        "metadata.interactedUser": req.user._id,
        "metadata.messageLocation": message._id,
      });

      if (
        interactedWithMessageBefore &&
        interactedWithMessageBefore.metadata.typeOfInteraction !== fieldName
      ) {
        interactedWithMessageBefore.metadata.typeOfInteraction = fieldName;
        interactedWithMessageBefore.isRead = false;

        const savedNotification = await (
          await interactedWithMessageBefore.save()
        ).populate("metadata.interactedUser", userExcludedFields);

        const targetSockets = onlineUsers.get(savedNotification.belongsTo.toString());
        if (targetSockets) {
          io.to([...targetSockets]).emit("notification", savedNotification);
        }
      }

      if (!interactedWithMessageBefore && message.sender._id.toString() !== req.user._id.toString()) {
        const newNotification = await Notification.create({
          type: "INTERACT-WITH-MESSAGE",
          belongsTo: message.sender._id,
          metadata: {
            interactedUser: req.user._id,
            messageLocation: message._id,
            typeOfInteraction: fieldName,
          },
        });

        await redisClient.del(`notifications:list:${message.sender._id}`);

        const populatedNotification = await Notification.findById(newNotification._id).populate(
          "metadata.interactedUser",
          userExcludedFields,
        );

        if (!populatedNotification) return res.status(404).json({ error: "an error occurred" });
        const targetSockets = onlineUsers.get(populatedNotification.belongsTo.toString());
        if (targetSockets) {
          io.to([...targetSockets]).emit("notification", populatedNotification);
        }
      }
    }

    if (message[getOtherTwoFields[0] as TypeFieldName].includes(req.user._id)) {
      const index = message[getOtherTwoFields[0] as TypeFieldName].indexOf(req.user._id);
      message[getOtherTwoFields[0] as TypeFieldName].splice(index, 1);
    }

    if (message[getOtherTwoFields[1] as TypeFieldName].includes(req.user._id)) {
      const index = message[getOtherTwoFields[1] as TypeFieldName].indexOf(req.user._id);
      message[getOtherTwoFields[1] as TypeFieldName].splice(index, 1);
    }

    const saveMessage = await message.save();
    const populatedMessage = await PublicMessage.findById(saveMessage._id).populate([
      { path: "sender", select: userExcludedFields },
      { path: "mentionedUsers", select: userExcludedFields },
    ]);

    await redisClient.del(`publicMessages:list:${messageId}`);
    if (populatedMessage) io.emit("public_chat_message_reaction", populatedMessage);
    return res.status(200).json(populatedMessage);
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred, Try again" });
  }
};
