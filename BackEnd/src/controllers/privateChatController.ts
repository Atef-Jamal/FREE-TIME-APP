/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import Conversation from "../models/conversation";
import User, { IUser } from "../models/user";
import PrivateMessage from "../models/privateMessage";
import { Types } from "mongoose";

export const getAllConversations = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
  const pageParam = Number(req.query.pageParam) || 1;
  let limit = 15;
  const skip = (pageParam - 1) * limit;

  try {
    const conversations = await Conversation.aggregate([
      {
        $match: { participants: currentUserId },
      },
      {
        $addFields: {
          secondUserId: {
            $filter: {
              input: "$participants",
              as: "userId",
              cond: { $ne: ["$$userId", currentUserId] },
            },
          },
        },
      },
      { $unwind: "$secondUserId" },
      {
        $lookup: {
          from: "users",
          localField: "secondUserId",
          foreignField: "_id",
          as: "secondUserData",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                profilePicture: 1,
                activeFrame: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$secondUserData" },
      {
        $lookup: {
          from: "privatemessages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessageDetails",
        },
      },
      { $unwind: "$lastMessageDetails" },
      {
        $lookup: {
          from: "users",
          localField: "lastMessageDetails.sender",
          foreignField: "_id",
          as: "lastMessageSenderDetails",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                profilePicture: 1,
                activeFrame: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$lastMessageSenderDetails" },
      {
        $lookup: {
          from: "users",
          localField: "lastMessageDetails.receiver",
          foreignField: "_id",
          as: "lastMessageReceveiverDetails",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                profilePicture: 1,
                activeFrame: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$lastMessageReceveiverDetails" },
      {
        $lookup: {
          from: "privatemessages",
          localField: "_id",
          foreignField: "conversationId",
          let: { secondUserId: "$secondUserId" },
          as: "messages",
          pipeline: [
            {
              $match: {
                $expr: { $and: [{ $eq: ["$sender", "$$secondUserId"] }, { $eq: ["$isRead", false] }] },
              },
            },
            { $count: "unreadCount" },
          ],
        },
      },
      { $unwind: "$messages" },
      {
        $project: {
          _id: 1,
          secondUser: "$secondUserData",
          lastMessageDetails: {
            _id: 1,
            conversationId: 1,
            sender: "$lastMessageSenderDetails",
            receiver: "$lastMessageReceveiverDetails",
            message: 1,
            isRead: 1,
            createdAt: 1,
            updatedAt: 1,
          },
          unReadCount: "$messages.unreadCount",
        },
      },
      {
        $project: {
          _id: 1,
          secondUser: "$secondUser",
          lastMessage: "$lastMessageDetails",
          unReadCount: 1,
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
      { $limit: limit },
      { $skip: skip },
    ]);

    const excludedUsers: Types.ObjectId[] = conversations.map((conv) => conv.secondUser._id);
    let newPotintialConversations: any[] = [];

    if (conversations.length < limit) {
      limit = limit - conversations.length;

      const users: IUser[] = await User.find({ _id: { $nin: [...excludedUsers, currentUserId] } })
        .select("_id name profilePicture activeFrame")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      newPotintialConversations = users.map((user) => ({
        _id: new Types.ObjectId(),
        secondUser: user,
        lastMessage: null,
        unReadCount: 0,
      }));
    }

    const allConversations = [...conversations, ...newPotintialConversations];

    const countAllUsers = await User.countDocuments({
      _id: { $ne: currentUserId },
    });

    const hasMore = pageParam * limit < countAllUsers;

    return res.status(200).json({ conversations: allConversations, hasMore });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "can not load all conversations" });
  }
};

export const getConversationMessages = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
  const { secondUserId } = req.params;
  const pageParam = Number(req.query.pageParam) || 1;
  const limit = 15;
  const skip = (pageParam - 1) * limit;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, secondUserId] },
    }).select("_id");

    const secondUser = await User.findById(secondUserId).select("_id name profilePicture activeFrame");

    if (!secondUser) {
      return res.status(404).json({ error: "user not found" });
    }

    if (!conversation) {
      return res.status(200).json({ messages: [], secondUser });
    }

    const messages = await PrivateMessage.find({ conversationId: conversation._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("sender", "_id name profilePicture")
      .populate("receiver", "_id name profilePicture");

    const reversedMessages = messages.reverse();
    const allMessagesLength = await PrivateMessage.countDocuments({ conversationId: conversation._id });
    const hasOlder = pageParam * limit < allMessagesLength;

    return res.status(200).json({ messages: reversedMessages, secondUser, hasOlder });
  } catch (error) {
    return res.status(404).json({ error: "can't Load Chat" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
  const { messageText, receiver } = req.body;

  try {
    let conversation = await Conversation.findOne({ participants: { $all: [currentUserId, receiver] } });

    if (!conversation) {
      conversation = new Conversation({
        participants: [currentUserId, receiver],
      });
      await conversation.save();
    }

    const newMessage = new PrivateMessage({
      conversationId: conversation._id,
      sender: currentUserId,
      receiver: receiver,
      message: messageText,
    });

    await newMessage.save();

    conversation.lastMessage = newMessage.id;

    await conversation.save();

    const message = await PrivateMessage.findById(newMessage._id)
      .populate("sender", "-password")
      .populate("receiver", "-password");

    if (!message) {
      return res.status(404).json({ error: "can't create message, an Error occurred" });
    }
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "can't create message, an Error occurred" });
  }
};

export const getAllUnReadedMessages = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;

  try {
    const messages = await PrivateMessage.find({ receiver: currentUserId, isRead: false });

    const usersIds: Types.ObjectId[] = [];

    messages.forEach((msg) => {
      usersIds.push(msg.sender);
    });

    return res.status(200).json(usersIds);
  } catch (error) {
    return res.status(404).json({ error: "can't Load unreaded messages" });
  }
};

export const markAsReaded = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
  const { secondUserId } = req.params;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, secondUserId] },
    }).select("_id");

    if (conversation) {
      await PrivateMessage.updateMany(
        { conversationId: conversation._id, receiver: currentUserId, isRead: false },
        { isRead: true },
      );
      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred" });
  }
};
