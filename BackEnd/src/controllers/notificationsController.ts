import { Request, Response } from "express";
import User from "../models/user";
import Notification from "../models/notification";
import { userExcludedFields } from "../constants";
import { redisClient } from "../lib/redis";

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user._id;
  try {
    const cacheKey = `notifications:list:${userId}`;
    const cachedNotifications = await redisClient.get(cacheKey);

    if (cachedNotifications) {
      return res.status(200).json(JSON.parse(cachedNotifications));
    }

    const notifications = await Notification.find({ belongsTo: userId })
      .populate([
        { path: "metadata.referredUser", select: userExcludedFields },
        { path: "metadata.mentionedUser", select: userExcludedFields },
        { path: "metadata.interactedUser", select: userExcludedFields },
        { path: "metadata.frame" },
      ])
      .sort({ createdAt: -1 });

    await redisClient.set(cacheKey, JSON.stringify(notifications));

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "can't Load your Notifications" });
  }
};

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const types = ["GUESS-CARD", "EMAIL-VERIFIED", "MUSIC", "REFERRER", "QUIZ-APP", "BUY-FRAME"];
    const notifications = await Notification.find({ belongsTo: userId, type: { $in: types } }).populate([
      { path: "metadata.referredUser", select: userExcludedFields },
      { path: "frame" },
    ]);
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(404).json({ error: "can't get user Activities" });
  }
};

export const markAsReaded = async (req: Request, res: Response) => {
  const userId = req.user._id;
  try {
    await Notification.updateMany(
      { belongsTo: userId, isRead: false },
      {
        $set: { isRead: true },
      },
    );

    return res.status(200).json([]);
  } catch (error) {
    return res.status(404).json({ error: "an unexpected Error happened" });
  }
};

export const collectNotificationReward = async (req: Request, res: Response) => {
  const notificationId = req.params.id;
  const currentUserId = req.user._id;

  try {
    const notify = await Notification.findById(notificationId);

    if (!notify) {
      return res.status(404).json({ error: "Reward Not Found" });
    }

    const isCollectedBefore = notify.metadata.isCollected;

    if (isCollectedBefore) {
      return res.status(404).json({ error: "Reward Already collected" });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $inc: { points: notify.metadata.prize },
    });

    notify.metadata.isCollected = true;
    const saveNotify = await notify.save();
    return res.status(200).json(saveNotify);
  } catch (error) {
    return res.status(404).json({ error: "can't collect a Reward, an error occurred" });
  }
};
