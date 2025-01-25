import { Request, Response } from "express";
import User from "../models/user";
import Referrer from "../models/notifications/referrer";
import Mention from "../models/notifications/mention";
import QuizeApp from "../models/notifications/quizeApp";
import GuessCard from "../models/notifications/guessCard";
import EmailVerfication from "../models/notifications/emailVerfication";
import Music from "../models/notifications/music";
import Announcement from "../models/notifications/announcement";
import MessageInteraction from "../models/notifications/messageInteraction";
import BuyFrame from "../models/notifications/buyFrame";
import mongoose from "mongoose";

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.currentUser._id;
  try {
    const promises = [
      Referrer.find({ belongsTo: userId }).populate("referredUser", "-password"),
      Mention.find({ belongsTo: userId }).populate("mentionedUser", "-password"),
      MessageInteraction.find({ belongsTo: userId }).populate("interactedUser", "-password"),
      BuyFrame.find({ belongsTo: userId }).populate("frame"),
      QuizeApp.find({ belongsTo: userId }),
      GuessCard.find({ belongsTo: userId }),
      EmailVerfication.find({ belongsTo: userId }),
      Music.find({ belongsTo: userId }),
      Announcement.find({ belongsTo: userId }),
    ];

    const allNotifications = await Promise.all(promises);

    const notifications = allNotifications
      .flat()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(404).json({ error: "can't Load your Notifications" });
  }
};

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const promises = [
      Referrer.find({ belongsTo: userId }).populate("referredUser", "-password"),
      BuyFrame.find({ belongsTo: userId }).populate("frame"),
      QuizeApp.find({ belongsTo: userId }),
      GuessCard.find({ belongsTo: userId }),
      EmailVerfication.find({ belongsTo: userId }),
      Music.find({ belongsTo: userId }),
    ];

    const allNotifications = await Promise.all(promises);
    const notifications = allNotifications
      .flat()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(404).json({ error: "can't get user Activities" });
  }
};

export const markAsReaded = async (req: Request, res: Response) => {
  const userId = req.currentUser._id;
  try {
    const promises = [
      Referrer.updateMany({ belongsTo: userId, isRead: false }, { isRead: true }),
      Mention.updateMany({ belongsTo: userId, isRead: false }, { isRead: true }),
      MessageInteraction.updateMany({ belongsTo: userId, isRead: false }, { isRead: true }),
      BuyFrame.updateMany({ belongsTo: userId, isRead: false }, { isRead: true }),
      QuizeApp.updateMany({ belongsTo: userId, isRead: false }, { isRead: true }),
      GuessCard.updateMany({ belongsTo: userId, isRead: false }, { isRead: true }),
      EmailVerfication.updateMany({ belongsTo: userId, isRead: false }, { isRead: true }),
      Music.updateMany({ belongsTo: userId, isRead: false }, { isRead: true }),
      Announcement.updateMany({ belongsTo: userId, isRead: false }, { isRead: true }),
    ];
    await Promise.all(promises);

    return res.status(200).json([]);
  } catch (error) {
    return res.status(404).json({ error: "an unexpected Error happened" });
  }
};

export const collectReward = async (req: Request, res: Response) => {
  const notificationId = req.params.id;
  const modelName = req.params.modelName;
  const currentUserId = req.currentUser._id;

  try {
    const notify = await mongoose.models[modelName].findById(notificationId);
    if (!notify) {
      return res.status(404).json({ error: "Reward Not Found" });
    }
    const isCollectedBefore = notify.isCollected;
    if (isCollectedBefore) {
      return res.status(404).json({ error: "Reward Already collected" });
    }
    await User.findByIdAndUpdate(currentUserId, {
      $inc: { points: notify.prize },
    });
    notify.isCollected = true;
    const saveNotify = await notify.save();
    return res.status(200).json(saveNotify);
  } catch (error) {
    return res.status(404).json({ error: "can't collect a Reward, an error occurred" });
  }
};
