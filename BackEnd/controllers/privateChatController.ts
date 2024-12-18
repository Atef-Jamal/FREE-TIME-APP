import { Request, Response } from "express";
import Conversation from "../models/conversation";
import User from "../models/user";

export const getConversationMessages = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
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
    const conversation = await Conversation.findOne({
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
    const conversation = await Conversation.findOne({
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

export const getAllConversations = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  try {
    const allUsers = await User.find({ _id: { $ne: currentUserId } });

    const newArray = await Promise.all(
      allUsers.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [currentUserId, user._id] },
        }).select("lastMessage messages");

        let lastMessage = null;
        let unreadedCount = 0;

        if (conversation) {
          lastMessage = conversation.lastMessage;
          conversation.messages.map((msg) => {
            if (
              msg.sender._id.toString() === user._id.toString() &&
              msg.isRead === false
            ) {
              unreadedCount += 1;
            }
          });
        }

        return {
          secondParty: {
            _id: user.toObject()._id,
            name: user.toObject().name,
            profilePicture: user.toObject().profilePicture,
            activeFrame: user.toObject().activeFrame,
          },
          lastMessage: lastMessage,
          unreadedCount: unreadedCount,
        };
      })
    );

    return res.status(200).json(newArray);
  } catch (error) {
    return res.status(404).json({ error: "can not load all conversations" });
  }
};
