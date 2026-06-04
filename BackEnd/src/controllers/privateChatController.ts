/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import UserModel, { IUser } from "../models/userModel.js";
import { Types } from "mongoose";
import { userExcludedFields } from "../constants/index.js";
import ConversationModel from "../models/conversationModel.js";
import PrivateMessageModel from "../models/privateMessageModel.js";

export const getAllConversations = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });

  const pageParam = Number(req.query.pageParam) || 1;
  let limit = 15;
  const skip = (pageParam - 1) * limit;

  try {
    let conversations = await ConversationModel.aggregate([
      {
        $match: { participants: req.user._id },
      },
      {
        $addFields: {
          secondUserId: {
            $filter: {
              input: "$participants",
              as: "userId",
              cond: { $ne: ["$$userId", req.user._id] },
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
          foreignField: "conversation",
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
            conversation: "$lastMessageDetails.conversation",
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

    if (conversations.length < limit) {
      limit = limit - conversations.length;
      const excludedUsersIds = await ConversationModel.aggregate([
        { $match: { participants: req.user._id } },
        {
          $addFields: {
            userId: {
              $filter: {
                input: "$participants",
                as: "user",
                cond: { $ne: ["$$user", req.user._id] },
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

      const users: IUser[] = await UserModel.find({ _id: { $nin: [...ids, req.user._id] } })
        .select(userExcludedFields)
        .sort({ isOnline: -1, points: -1, emailVerified: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const potintialConversations = users.map((user) => ({
        _id: new Types.ObjectId(),
        secondUser: user,
        lastMessage: null,
        unReadCount: 0,
      }));

      conversations = [...conversations, ...potintialConversations];
    }

    const hasMore = limit === conversations.length;

    return res.status(200).json({ conversations, hasMore });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "can not load all conversations" });
  }
};

export const getConversationMessages = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { secondUserId } = req.params;
  const pageParam = Number(req.query.pageParam) || 1;
  const limit = 15;
  const skip = (pageParam - 1) * limit;

  try {
    const secondUser = await UserModel.findById(new Types.ObjectId(secondUserId)).select(userExcludedFields);
    if (!secondUser) return res.status(404).json({ error: "user not found" });

    const messages = await PrivateMessageModel.find({
      $or: [
        { sender: req.user._id, receiver: secondUser._id },
        { sender: secondUser._id, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate([
        { path: "sender", select: userExcludedFields },
        { path: "receiver", select: userExcludedFields },
      ]);

    const reversedMessages = messages.reverse();
    const hasMore = limit === messages.length;
    return res.status(200).json({ messages: reversedMessages, hasMore });
  } catch (error) {
    return res.status(404).json({ error: "can't Load Chat" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { messageText, receiver } = req.body;

  try {
    let conversation = await ConversationModel.findOne({ participants: { $all: [req.user._id, receiver] } });

    if (!conversation) {
      conversation = new ConversationModel({
        participants: [req.user._id, receiver],
      });
    }

    const newMessage = await PrivateMessageModel.create({
      conversation: conversation._id,
      sender: req.user._id,
      receiver: receiver,
      message: messageText,
    });

    conversation.lastMessage = newMessage._id;

    await conversation.save();

    const message = await PrivateMessageModel.findById(newMessage._id)
      .populate("sender", userExcludedFields)
      .populate("receiver", userExcludedFields);

    if (!message) return res.status(404).json({ error: "can't create message, an Error occurred" });

    return res.status(200).json(message);
  } catch (error) {
    return res.status(404).json({ error: "can't create message, an Error occurred" });
  }
};

export const getUnreadConversationsCount = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  try {
    const messages = await PrivateMessageModel.find({ receiver: req.user._id, isRead: false }).select(
      "sender",
    );
    const usersIds = messages.map((msg) => msg.sender);
    return res.status(200).json({ senderIds: usersIds });
  } catch (error) {
    return res.status(404).json({ error: "can't Load unreaded messages" });
  }
};

export const markAsReaded = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { secondUserId } = req.params;
  try {
    const conversation = await ConversationModel.findOne({
      participants: { $all: [req.user._id, secondUserId] },
    }).select("_id");

    if (conversation) {
      await PrivateMessageModel.updateMany(
        { conversation: conversation._id, receiver: req.user._id, isRead: false },
        { isRead: true },
      );
      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred" });
  }
};
