/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import Conversation from "../models/conversation";
import User from "../models/user";
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
      { $sort: { updatedAt: -1 } },
      { $limit: limit },
      { $skip: skip },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participantDetails",
        },
      },
      {
        $addFields: {
          otherParticipant: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$participantDetails",
                  as: "participant",
                  cond: { $ne: ["$$participant._id", currentUserId] }, // Exclude the requesting user
                },
              },
              0,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "privatemessages",
          localField: "_id",
          foreignField: "conversationId",
          as: "messages",
        },
      },
      {
        $addFields: {
          unReadCount: {
            $size: {
              $filter: {
                input: "$messages",
                as: "msg",
                cond: {
                  $and: [
                    { $eq: ["$$msg.receiver", currentUserId] }, // Unread messages for the user
                    { $eq: ["$$msg.isRead", false] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "privatemessages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessageDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "lastMessageDetails.sender",
          foreignField: "_id",
          as: "lastMessageDetailSender",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "lastMessageDetails.receiver",
          foreignField: "_id",
          as: "lastMessageDetailReceiver",
        },
      },
      { $unwind: { path: "$lastMessageDetailSender", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$lastMessageDetailReceiver", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$lastMessageDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          secondParty: {
            _id: "$otherParticipant._id",
            name: "$otherParticipant.name",
            profilePicture: "$otherParticipant.profilePicture",
            activeFrame: "$otherParticipant.activeFrame",
          },
          lastMessage: {
            _id: "$lastMessageDetails._id",
            conversationId: "$lastMessageDetails.conversationId",
            isRead: "$lastMessageDetails.isRead",
            sender: "$lastMessageDetailSender",
            receiver: "$lastMessageDetailReceiver",
            message: "$lastMessageDetails.message",
            createdAt: "$lastMessageDetails.createdAt",
          },
          unReadCount: 1,
        },
      },
    ]);

    const excludedUsers: Types.ObjectId[] = conversations.map((conv) => conv.secondParty._id);
    let newPotintialConversations: any[] = [];

    if (conversations.length < limit) {
      limit = limit - conversations.length;

      const users = await User.find({ _id: { $nin: [...excludedUsers, currentUserId] } })
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      newPotintialConversations = users.map((user) => ({
        _id: new Types.ObjectId(),
        secondParty: user,
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
