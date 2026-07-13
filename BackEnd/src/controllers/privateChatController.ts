import { Request, Response } from "express";
import User from "../models/user.js";
import { Types } from "mongoose";
import { userExcludedFields } from "../constants/index.js";
import Conversation from "../models/conversation.js";
import PrivateMessage from "../models/privateMessage.js";
import { io } from "../app.js";
import { getActiveConversationKey } from "../utils/index.js";
import { activeConversations, activeUserConnections } from "../socketIo/index.js";

export const getAllConversations = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const currentUserId = req.user._id;
  const pageParam = Number(req.query.pageParam) || 1;
  const limit = 15;
  const skip = (pageParam - 1) * limit;

  try {
    let conversations = await Conversation.aggregate([
      { $match: { _id: { $in: req.user.conversationIds } } },
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
      { $unwind: { path: "$secondUserId" } },
      {
        $lookup: {
          from: "users",
          localField: "secondUserId",
          foreignField: "_id",
          as: "secondUser",
          pipeline: [
            {
              $lookup: {
                from: "frames",
                localField: "activeFrame",
                foreignField: "_id",
                as: "activeFrameData",
                pipeline: [
                  {
                    $project: {
                      image: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: { path: "$activeFrameData", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 1,
                name: 1,
                profilePicture: 1,
                activeFrame: "$activeFrameData",
              },
            },
          ],
        },
      },
      { $unwind: { path: "$secondUser" } },
      {
        $lookup: {
          from: "privatemessages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessageData",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "senderData",
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
            {
              $lookup: {
                from: "users",
                localField: "receiver",
                foreignField: "_id",
                as: "receiverData",
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
            {
              $unwind: {
                path: "$senderData",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$receiverData",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                sender: "$senderData",
                receiver: "$receiverData",
                message: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$lastMessageData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          conversationName: 1,
          participants: 1,
          secondUser: 1,
          lastMessage: "$lastMessageData",
          unreadCounts: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    if (conversations.length < limit) {
      const newLimit = limit - conversations.length;
      const newSkip = (pageParam - 1) * newLimit;

      const existingConversation = await Conversation.find({ _id: { $in: req.user.conversationIds } }).select(
        "participants",
      );
      const usersToExclude = existingConversation.map((conv) =>
        conv.participants.find((userId) => userId.toString() !== currentUserId.toString()),
      ) as Types.ObjectId[];

      const users = await User.find({ _id: { $nin: [...usersToExclude, currentUserId] } })
        .select("_id name profilePicture")
        .populate("activeFrame")
        .sort({ isOnline: -1, points: -1, emailVerified: 1, createdAt: -1 })
        .skip(newSkip)
        .limit(newLimit);

      const potentialConversations = users.map((user) => ({
        _id: new Types.ObjectId(),
        conversationName: "",
        participants: [currentUserId, user._id],
        secondUser: user,
        unreadCounts: new Map([
          [currentUserId.toString(), 0],
          [user._id.toString(), 0],
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      conversations = [...conversations, ...potentialConversations];
    }

    const hasMore = limit === conversations.length;

    return res.status(200).json({ conversations, hasMore });
  } catch (error) {
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
    const secondUser = await User.findById(new Types.ObjectId(secondUserId)).select(userExcludedFields);
    if (!secondUser) return res.status(404).json({ error: "user not found" });

    const messages = await PrivateMessage.find({
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
    let conversation = await Conversation.findOne({ participants: { $all: [req.user._id, receiver] } });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, receiver],
        unreadCounts: new Map([
          [req.user._id.toString(), 0],
          [receiver.toString(), 0],
        ]),
      });
      await User.updateMany(
        {
          _id: { $in: [req.user._id, receiver] },
        },
        {
          $push: {
            conversationIds: conversation._id,
          },
        },
      );
    }

    const key = getActiveConversationKey(req.user._id.toString(), receiver);

    const newMessage = await PrivateMessage.create({
      conversation: conversation._id,
      sender: req.user._id,
      receiver: receiver,
      message: messageText,
      ...(activeConversations.get(key)?.has(receiver) ? { isRead: true } : {}),
    });

    conversation.lastMessage = newMessage._id;

    if (!activeConversations.get(key)?.has(receiver)) {
      conversation.unreadCounts.set(
        receiver.toString(),
        conversation.unreadCounts.get(receiver.toString())! + 1,
      );
    }

    await conversation.save();

    const message = await PrivateMessage.findById(newMessage._id)
      .populate("sender", userExcludedFields)
      .populate("receiver", userExcludedFields);

    if (!message) return res.status(404).json({ error: "can't create message, an Error occurred" });

    const targetSocketIds = activeUserConnections.get(receiver.toString());

    if (targetSocketIds) {
      io.to([...targetSocketIds]).emit("private_chat_message", message);
    }
    return res.status(200).json(message);
  } catch (error) {
    return res.status(404).json({ error: "can't create message, an Error occurred" });
  }
};

export const getUnreadConversationsCount = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const currentUserId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: currentUserId,
      [`unreadCounts.${currentUserId.toString()}`]: { $gt: 0 },
    });
    const counts = conversations.reduce((count, conversation) => {
      const userCount = conversation.unreadCounts.get(currentUserId.toString()) || 0;
      return count + userCount;
    }, 0);
    return res.status(200).json({ counts });
  } catch (error) {
    return res.status(404).json({ error: "can't Load unreaded messages" });
  }
};

export const conversationIsRead = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { secondUserId } = req.params;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, secondUserId] },
    }).select("_id");

    if (!conversation) return res.status(404).json({ error: "an error occurred" });

    await Promise.all([
      Conversation.findByIdAndUpdate(
        conversation._id,
        {
          $set: {
            [`unreadCounts.${req.user._id.toString()}`]: 0,
          },
        },
        { strict: false },
      ),
      PrivateMessage.updateMany(
        {
          conversation: conversation._id,
          sender: secondUserId,
          isRead: false,
        },
        {
          isRead: true,
        },
      ),
    ]);

    const targetSocketIds = activeUserConnections.get(secondUserId.toString());

    if (targetSocketIds) {
      io.to([...targetSocketIds]).emit("conversation_read", {
        receiver: secondUserId,
        sender: req.user._id.toString(),
      });
    }

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred" });
  }
};
