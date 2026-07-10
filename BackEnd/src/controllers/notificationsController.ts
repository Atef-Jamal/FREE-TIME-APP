import { Request, Response } from "express";
import { userExcludedFields } from "../constants/index.js";
import { redisClient } from "../lib/redis.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import { io } from "../app.js";

export const getNotifications = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  try {
    const cacheKey = `notifications:list:${req.user._id.toString()}`;
    const cachedNotifications = await redisClient.get(cacheKey);

    if (cachedNotifications) {
      return res.status(200).json(JSON.parse(cachedNotifications));
    }

    const notifications = await Notification.find({ belongsTo: req.user._id })
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
  const userId = req.params.id;
  try {
    const notifications = await Notification.find({
      belongsTo: userId,
      type: { $in: ["GUESS-CARD", "EMAIL-VERIFIED", "MUSIC", "REFERRER", "QUIZ-APP", "BUY-FRAME"] },
    }).populate([{ path: "metadata.referredUser", select: userExcludedFields }, { path: "frame" }]);
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(404).json({ error: "can't get user Activities" });
  }
};

export const notificationsRead = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  try {
    const readNotificationsPromise = await Notification.updateMany(
      { belongsTo: req.user._id, isRead: false },
      {
        $set: { isRead: true },
      },
    );
    const deleteRedisCachePromise = redisClient.del(`notifications:list:${req.user._id.toString()}`);
    await Promise.all([readNotificationsPromise, deleteRedisCachePromise]);
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return res.status(404).json({ error: "an unexpected Error happened" });
  }
};

export const collectNotificationReward = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const notificationId = req.params.id;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ error: "Reward Not Found" });

    const isCollectedBefore = notification.metadata.isCollected;
    if (isCollectedBefore) return res.status(404).json({ error: "Reward Already collected" });

    const updateUserPromise = User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: notification.metadata.prize },
      },
      { returnDocument: "after" },
    ).populate("activeFrame");

    const updateNotificationPromise = Notification.findByIdAndUpdate(
      notification._id,
      {
        "metadata.isCollected": true,
      },
      { returnDocument: "after" },
    );

    const [updatedNotification, updatedUser] = await Promise.all([
      updateNotificationPromise,
      updateUserPromise,
    ]);

    if (updatedUser) io.emit("user_updated", updatedUser);

    return res.status(200).json(updatedNotification);
  } catch (error) {
    return res.status(404).json({ error: "can't collect a Reward, an error occurred" });
  }
};
