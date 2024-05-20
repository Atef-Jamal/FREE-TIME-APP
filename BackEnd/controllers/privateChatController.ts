import { Request, Response } from "express";
import Conversation from "../models/conversation";
import User from "../models/user";
// import { io, onLineUsers } from "../app";

export const getConversationMessages = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { seconduserid } = req.params;
  try {
    const getConversation = await Conversation.findOne({
      participants: { $all: [currentUserId, seconduserid] },
    });
    const secondUser = await User.findById(seconduserid).select("-password");

    if (!secondUser) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (!getConversation) {
      return res.status(200).json({ messages: [], secondUser: secondUser });
    }
    const conversation = await getConversation.populate(
      "messages.sender",
      "-password"
    );
    return res
      .status(200)
      .json({ messages: conversation.messages, secondUser: secondUser });
  } catch (error) {
    return res.status(404).json({ error: "can't Load Chat" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { seconduserid } = req.params;
  const { messageText } = req.body;
  try {
    let getConversation = await Conversation.findOne({
      participants: { $all: [currentUserId, seconduserid] },
    });

    if (!getConversation) {
      getConversation = new Conversation({
        participants: [currentUserId, seconduserid],
      });
    }

    getConversation.messages.push({
      message: messageText,
      sender: currentUserId,
    });

    getConversation.lastMessage =
      getConversation.messages[getConversation.messages.length - 1];

    const saveConversation = await getConversation.save();
    const conversation = await saveConversation.populate("lastMessage.sender");

    // io.to(onLineUsers[seconduserid]).emit(
    //   "private-message",
    //   conversation.lastMessage
    // );

    return res.status(200).json(conversation.lastMessage);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "can't create message, an Error occurred" });
  }
};

export const getRecentMessage = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { seconduserid } = req.params;
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, seconduserid] },
    }).select("lastMessage");

    if (!conversation) {
      return res.status(200).json(null);
    }

    return res.status(200).json(conversation.lastMessage);
  } catch (error) {
    return res.status(404).json({ error: "can't Load lastest message" });
  }
};

export const getUnReadedMsgsCount = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { seconduserid } = req.params;
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, seconduserid] },
    }).select("messages");

    if (!conversation) {
      return res.status(200).json(0);
    }
    const unReadedCount = conversation.messages.filter((item) => {
      return item.sender?.toString() === seconduserid && item.isRead === false;
    }).length;

    return res.status(200).json({ count: unReadedCount });
  } catch (error) {
    return res.status(404).json({ error: "can't Load unreaded messages" });
  }
};

export const getAllUnReadedMessages = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;

  try {
    const conversations = await Conversation.find({
      participants: { $in: [currentUserId] },
    });

    if (!conversations) {
      return res.status(200).json([]);
    }

    const usersIds: string[] = [];

    conversations.forEach((conversation) => {
      conversation.messages.forEach((message) => {
        if (
          message.sender &&
          message.sender.toString() !== currentUserId.toString() &&
          message.isRead === false
        ) {
          usersIds.push(message.sender.toString());
        }
      });
    });

    return res.status(200).json(usersIds);
  } catch (error) {
    return res.status(404).json({ error: "can't Load unreaded messages" });
  }
};

export const markAsReaded = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { seconduserid } = req.params;
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, seconduserid] },
    });

    if (!conversation) {
      return res.status(200).json({ message: "success" });
    }

    conversation.messages.forEach((item) => {
      if (item.sender?.toString() === seconduserid && item.isRead === false) {
        return (item.isRead = true);
      }
    });
    await conversation.save();
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred" });
  }
};
