/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import Conversation from "../models/conversation";
import User, { IUser } from "../models/user";
import PrivateMessage from "../models/privateMessage";
import mongoose, { Types } from "mongoose";
import { userExcludedFields } from "../constants";

export const getAllConversations = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
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
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          secondUser: "$secondUserData",
          lastMessage: {
            _id: "$lastMessageDetails._id",
            conversationId: "$lastMessageDetails.conversationId",
            sender: "$lastMessageSenderDetails",
            receiver: "$lastMessageReceveiverDetails",
            message: "$lastMessageDetails.message",
            isRead: "$lastMessageDetails.isRead",
            createdAt: "$lastMessageDetails.createdAt",
            updatedAt: "$lastMessageDetails.updatedAt",
          },
          unReadCount: { $ifNull: ["$messages.unreadCount", 0] },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    let newPotintialConversations: any[] = [];

    if (conversations.length < limit) {
      limit = limit - conversations.length;
      const excludedUsersIds = await Conversation.aggregate([
        { $match: { participants: currentUserId } },
        {
          $addFields: {
            userId: {
              $filter: {
                input: "$participants",
                as: "user",
                cond: { $ne: ["$$user", currentUserId] },
              },
            },
          },
        },
        { $unwind: { path: "$userId" } },
        {
          $project: {
            _id: -1,
            userId: 1,
          },
        },
      ]);

      const ids = excludedUsersIds.map((i) => i.userId);

      const users: IUser[] = await User.find({ _id: { $nin: [...ids, currentUserId] } })
        .select(userExcludedFields)
        .sort({ isOnline: -1, points: -1, emailVerified: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const createPotintialConversations = users.map((user) => ({
        _id: new Types.ObjectId(),
        secondUser: user,
        lastMessage: null,
        unReadCount: 0,
      }));
      newPotintialConversations = [...newPotintialConversations, ...createPotintialConversations];
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
  const currentUserId = req.user._id;
  const { secondUserId } = req.params;
  const secondUserIdObjId = new mongoose.Types.ObjectId(secondUserId);
  const pageParam = Number(req.query.pageParam) || 1;
  const limit = 15;
  const skip = (pageParam - 1) * limit;

  try {
    const secondUser = await User.findById(secondUserIdObjId).select(userExcludedFields);

    if (!secondUser) {
      return res.status(404).json({ error: "user not found" });
    }

    const messages = await PrivateMessage.find({
      $or: [
        { sender: currentUserId, receiver: secondUserIdObjId },
        { sender: secondUserIdObjId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("sender", userExcludedFields)
      .populate("receiver", userExcludedFields);

    const reversedMessages = messages.reverse();
    const hasOlder = pageParam * limit <= messages.length;
    return res.status(200).json({ messages: reversedMessages, secondUser, hasOlder });
  } catch (error) {
    return res.status(404).json({ error: "can't Load Chat" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
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
      .populate("sender", userExcludedFields)
      .populate("receiver", userExcludedFields);

    if (!message) {
      return res.status(404).json({ error: "can't create message, an Error occurred" });
    }
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "can't create message, an Error occurred" });
  }
};

export const getUnreadConversationsCount = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  try {
    const messages = await PrivateMessage.find({ receiver: currentUserId, isRead: false });
    const usersIds = messages.map((msg) => msg.sender);
    return res.status(200).json({ senderIds: usersIds });
  } catch (error) {
    return res.status(404).json({ error: "can't Load unreaded messages" });
  }
};

export const markAsReaded = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
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
