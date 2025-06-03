/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import PublicMessage from "../models/publicMessage";
import { io } from "../socketIo/socketIo";
import { onLineUsers } from "../socketIo/socketIo";
import Notification from "../models/notification";
import { userExcludedFields } from "../constants";

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

    const count = await PublicMessage.countDocuments();
    const hasOlder = pageParam * limit < count;

    const reversed = messages.reverse();
    return res.status(200).json({ messages: reversed, hasOlder });
  } catch (error) {
    return res.status(404).json({ error: "can't Load public chat" });
  }
};

export const createPublicMessage = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
  const { messageText, type, mentionedUsers } = req.body;
  try {
    const message = new PublicMessage({
      sender: currentUserId,
      message: messageText,
      mentionedUsers: mentionedUsers,
      type,
    });

    const saveMessage = await message.save();
    const savedMessage = await saveMessage.populate([
      { path: "sender", select: userExcludedFields },
      { path: "mentionedUsers", select: userExcludedFields },
      { path: "newUserReferred", select: userExcludedFields },
    ]);

    if (mentionedUsers.length > 0) {
      const newNotifications: any[] = [];
      mentionedUsers.forEach((userId: any) => {
        const newNotification = new Notification({
          type: "MENTION",
          belongsTo: userId,
          metadata: {
            mentionedUser: currentUserId,
            messageLocation: saveMessage._id,
          },
        });
        newNotifications.push(newNotification);
      });

      const saveNotifications = await Notification.insertMany(newNotifications);
      const ids = saveNotifications.map((item) => item._id);
      const getCreatedNotifications = await Notification.find({ _id: { $in: ids } }).populate(
        "metadata.mentionedUser",
        userExcludedFields,
      );
      getCreatedNotifications.forEach((notify) => {
        io.to(onLineUsers[notify.belongsTo.toString()]).emit("new-notification", notify);
      });
    }
    return res.status(200).json(savedMessage);
  } catch (error) {
    return res.status(404).json({ error: "can't send your message, an Error occurred" });
  }
};

export const deletePublicMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const currentUserId = req.currentUser._id;
  try {
    const deletedMessage = await PublicMessage.findOneAndUpdate(
      { _id: messageId, sender: currentUserId },
      {
        isDeleted: true,
      },
      { new: true },
    ).populate("sender", userExcludedFields);
    return res.status(200).json(deletedMessage);
  } catch (error) {
    return res.status(404).json({ error: "can't delete message" });
  }
};

export const getSingleMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  try {
    const message = await PublicMessage.findById(messageId).populate([
      { path: "sender", select: userExcludedFields },
      { path: "mentionedUsers", select: userExcludedFields },
    ]);
    if (!message) {
      return res.status(404).json({ error: "Message Not Found" });
    }
    return res.status(200).json(message);
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred, Try again" });
  }
};

export const reactToPublicMessage = async (req: Request, res: Response) => {
  type TypeFieldName = "loves" | "dislikes" | "likes";
  const currentUserId = req.currentUser._id;
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

    if (message[fieldName].includes(currentUserId)) {
      const index = message[fieldName].indexOf(currentUserId);
      message[fieldName].splice(index, 1);
    } else {
      message[fieldName].push(currentUserId);
      const interactedWithMessageBefore = await Notification.findOne({
        belongsTo: message.sender._id,
        "metadata.interactedUser": currentUserId,
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

        io.to(onLineUsers[savedNotification.belongsTo.toString()]).emit(
          "new-notification",
          savedNotification,
        );
      }

      if (!interactedWithMessageBefore && message.sender._id.toString() !== currentUserId.toString()) {
        const createNotification = new Notification({
          type: "INTERACT-WITH-MESSAGE",
          belongsTo: message.sender._id,
          metadata: {
            interactedUser: currentUserId,
            messageLocation: message._id,
            typeOfInteraction: fieldName,
          },
        });

        const savedNotification = await (
          await createNotification.save()
        ).populate("metadata.interactedUser", userExcludedFields);

        io.to(onLineUsers[savedNotification.belongsTo.toString()]).emit(
          "new-notification",
          savedNotification,
        );
      }
    }

    if (message[getOtherTwoFields[0] as TypeFieldName].includes(currentUserId)) {
      const index = message[getOtherTwoFields[0] as TypeFieldName].indexOf(currentUserId);
      message[getOtherTwoFields[0] as TypeFieldName].splice(index, 1);
    }

    if (message[getOtherTwoFields[1] as TypeFieldName].includes(currentUserId)) {
      const index = message[getOtherTwoFields[1] as TypeFieldName].indexOf(currentUserId);
      message[getOtherTwoFields[1] as TypeFieldName].splice(index, 1);
    }

    const saveMessage = await message.save();
    const savedMessage = await saveMessage.populate([
      { path: "sender", select: userExcludedFields },
      { path: "mentionedUsers", select: userExcludedFields },
    ]);

    return res.status(200).json(savedMessage);
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred, Try again" });
  }
};
