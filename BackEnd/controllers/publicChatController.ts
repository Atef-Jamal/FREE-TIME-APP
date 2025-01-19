import { Request, Response } from "express";
import PublicMessage from "../models/publicMessage";
import Notification from "../models/notification";
import { io } from "../app";
import { onLineUsers } from "../socketIo/socketIo";

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
        { path: "sender", select: "-password" },
        { path: "mentioned", select: "-password" },
        { path: "newUserReferred", select: "-password" },
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
      mentioned: mentionedUsers,
      type,
    });

    const saveMessage = await message.save();
    const savedMessage = await saveMessage.populate([
      { path: "sender", select: "-password" },
      { path: "mentioned", select: "-password" },
      { path: "newUserReferred", select: "-password" },
    ]);

    if (mentionedUsers.length > 0) {
      const newNotifications: any[] = [];

      mentionedUsers.forEach((user: any) => {
        const newNotification = new Notification({
          belongsTo: user._id,
          type: "MENTION",
          mentionedUser: currentUserId,
          messageLocation: saveMessage._id,
        });
        newNotifications.push(newNotification);
      });

      const saveNotifications = await Notification.insertMany(newNotifications);
      const ids = saveNotifications.map((item) => item._id);
      const getCreatedNotifications = await Notification.find({ _id: { $in: ids } }).populate(
        "mentionedUser",
        "-password",
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
    ).populate("sender", "-password");
    return res.status(200).json(deletedMessage);
  } catch (error) {
    return res.status(404).json({ error: "can't delete message" });
  }
};

export const getSingleMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  try {
    const message = await PublicMessage.findById(messageId).populate([
      { path: "sender", select: "-password" },
      { path: "mentioned", select: "-password" },
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
        interactedUser: currentUserId,
        messageLocation: message._id,
        // typeOfInteraction: fieldName,
      });

      if (interactedWithMessageBefore && interactedWithMessageBefore.typeOfInteraction !== fieldName) {
        interactedWithMessageBefore.typeOfInteraction = fieldName;
        interactedWithMessageBefore.isRead = false;

        const savedNotification = await (
          await interactedWithMessageBefore.save()
        ).populate("interactedUser", "_id name profilePicture activeFrame");

        io.to(onLineUsers[savedNotification.belongsTo.toString()]).emit(
          "new-notification",
          savedNotification,
        );
      }

      if (!interactedWithMessageBefore && message.sender._id.toString() !== currentUserId.toString()) {
        const createNotification = new Notification({
          type: "INTERACT-WITH-MESSAGE",
          belongsTo: message.sender._id,
          messageLocation: message._id,
          typeOfInteraction: fieldName,
          interactedUser: currentUserId,
        });

        const savedNotification = await (
          await createNotification.save()
        ).populate("interactedUser", "_id name profilePicture activeFrame");

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
      { path: "sender", select: "-password" },
      { path: "mentioned", select: "-password" },
    ]);

    return res.status(200).json(savedMessage);
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred, Try again" });
  }
};
