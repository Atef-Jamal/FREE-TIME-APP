import { Request, Response } from "express";
import Conversation from "../models/conversation";
import User from "../models/user";
import { Types } from "mongoose";

export const getAllConversations = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
  const pageParam = Number(req.query.pageParam) || 1;
  const limit = 15;
  const skip = (pageParam - 1) * limit;
  try {
    const conversations = await Conversation.find({
      participants: { $in: [currentUserId] },
    })
      .sort({ "lastMessage.createdAt": 1 })
      .skip(skip)
      .limit(limit)
      .select("participants lastMessage messages")
      .populate("lastMessage.sender", "_id name")
      .populate("participants", "_id name profilePicture activeFrame");

    const numOfConversations = conversations.length;
    const excludeThoseUsers: Types.ObjectId[] = [currentUserId];

    const newArr = conversations.map((conv) => {
      let count = 0;
      conv.messages.forEach((msg) => {
        if (msg.sender !== currentUserId && msg.isRead === false) {
          count = count + 1;
        }
      });
      const second = conv.participants.filter(
        (user) => user._id.toString() !== currentUserId.toString()
      )[0];

      excludeThoseUsers.push(second._id);
      return {
        secondParty: second,
        lastMessage: conv.lastMessage,
        unreadedCount: count,
      };
    });

    let users: any[] = [];

    if (numOfConversations < limit) {
      const difference = limit - numOfConversations;
      const skipOther = (pageParam - 1) * (limit - numOfConversations);

      const allUsers = await User.find({ _id: { $nin: excludeThoseUsers } })
        .sort({ points: -1, createdAt: -1 })
        .skip(skipOther)
        .limit(difference);
      users = allUsers.map((user) => {
        return {
          secondParty: user,
          lastMessage: null,
          unreadedCount: 0,
        };
      });
    }

    const results = [...newArr, ...users];

    const countAllUsers = await User.countDocuments({
      _id: { $ne: currentUserId },
    });
    const hasMore = pageParam * limit < countAllUsers;

    return res.status(200).json({ conversations: results, hasMore });
  } catch (error) {
    return res.status(404).json({ error: "can not load all conversations" });
  }
};

export const getConversationMessages = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
  const { seconduserid } = req.params;
  try {
    const getConversation = await Conversation.findOne({
      participants: { $all: [currentUserId, seconduserid] },
    });

    const getSecondUser = await User.findById(seconduserid).select("-password");

    if (!getSecondUser) {
      return res.status(404).json({ error: "User Not Found" });
    }
    if (!getConversation) {
      return res.status(200).json({ messages: [], secondUser: getSecondUser });
    }

    const conversation = await getConversation.populate(
      "messages.sender",
      "-password"
    );
    return res
      .status(200)
      .json({ messages: conversation.messages, secondUser: getSecondUser });
  } catch (error) {
    return res.status(404).json({ error: "can't Load Chat" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
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

    return res.status(200).json(conversation.lastMessage);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "can't create message, an Error occurred" });
  }
};

export const getAllUnReadedMessages = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;

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
  const currentUserId = req.currentUser._id;
  const { seconduserid } = req.params;
  try {
    const conversation = await Conversation.findOne({
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
