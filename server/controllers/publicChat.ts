import { Request, Response } from "express";
import PublicMessage from "../models/publicMessage";
import Notification from "../models/notification";
import { io, onLineUsers } from "../server";

export const getAllPublicMessages = async (req: Request, res: Response) => {
  try {
    const messages = await PublicMessage.find({}).populate([
      { path: "sender", select: "-password" },
      { path: "mentioned", select: "-password" },
      { path: "newUserReferred", select: "-password" },
    ]);
    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "server - can not get public messages" });
  }
};

export const createPublicMessage = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { messageText, type, mentioned } = req.body;
  try {
    const message = new PublicMessage({
      sender: currentUserId,
      message: messageText,
      mentioned,
      type,
    });

    const saveMessage = await message.save();
    const savedMessage = await saveMessage.populate([
      { path: "sender", select: "-password" },
      { path: "mentioned", select: "-password" },
      { path: "newUserReferred", select: "-password" },
    ]);

    if (mentioned) {
      const createNotification = new Notification({
        belongsTo: mentioned,
        type: "MENTION",
        mentionedUser: currentUserId,
        messageLocation: saveMessage._id,
      });
      const saveNotification = await createNotification.save();
      const savedNotification = await saveNotification.populate(
        "mentionedUser",
        "-password"
      );
      io.to(onLineUsers[mentioned]).emit("new-notification", savedNotification);
    }
    return res.status(200).json(savedMessage);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "server - can not create public message" });
  }
};

export const deletePublicMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const currentUserId = req.user._id;
  try {
    const deletedMessage = await PublicMessage.findOneAndUpdate(
      { _id: messageId, sender: currentUserId },
      {
        isDeleted: true,
      },
      { new: true }
    ).populate("sender", "-password");
    return res.status(200).json(deletedMessage);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "server - can not delete public message" });
  }
};

export const reactToPublicMessage = async (req: Request, res: Response) => {
  type TypeFieldName = "loves" | "dislikes" | "likes";
  const currentUserId = req.user._id;
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
        error: "server - can not find public message to interact with",
      });
    }

    if (message[fieldName].includes(currentUserId)) {
      const index = message[fieldName].indexOf(currentUserId);
      message[fieldName].splice(index, 1);
    } else {
      message[fieldName].push(currentUserId);
    }

    if (
      message[getOtherTwoFields[0] as TypeFieldName].includes(currentUserId)
    ) {
      const index =
        message[getOtherTwoFields[0] as TypeFieldName].indexOf(currentUserId);
      message[getOtherTwoFields[0] as TypeFieldName].splice(index, 1);
    }

    if (
      message[getOtherTwoFields[1] as TypeFieldName].includes(currentUserId)
    ) {
      const index =
        message[getOtherTwoFields[1] as TypeFieldName].indexOf(currentUserId);
      message[getOtherTwoFields[1] as TypeFieldName].splice(index, 1);
    }

    const saveMessage = await message.save();
    const savedMessage = await saveMessage.populate("sender", "-password");

    return res.status(200).json(savedMessage);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "server - can not interact with public message" });
  }
};
