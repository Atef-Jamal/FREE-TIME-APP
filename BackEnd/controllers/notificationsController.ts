import { Request, Response } from "express";
import Notification from "../models/notification";
import User from "../models/user";

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.currentUser._id;
  try {
    const notifications = await Notification.find({
      belongsTo: userId,
    })
      .sort({ updatedAt: "descending" })
      .populate(["mentionedUser", "referredUser", "frame", "interactedUser"]);

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(404).json({ error: "can't Load your Notifications" });
  }
};

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const allNotifications = await Notification.find({
      belongsTo: userId,
    })
      .populate("referredUser", "-password")
      .populate("frame");
    return res.status(200).json(allNotifications);
  } catch (error) {
    return res.status(404).json({ error: "can't get user Activities" });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  const requestBody = req.body;
  try {
    const notification = new Notification(requestBody);

    if (!notification) {
      return res.status(404).json({ error: "can't create notification" });
    }

    return res.status(200).json(notification);
  } catch (error) {
    return res.status(200).json({ error: "an Error occurred" });
  }
};

export const markAsReaded = async (req: Request, res: Response) => {
  const userid = req.currentUser._id;

  try {
    const notifications = await Notification.updateMany(
      { belongsTo: userid, isRead: false },
      { isRead: true }
    );

    if (!notifications) {
      return res.status(404).json({ error: "Somtign went wrong" });
    }

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(404).json({ error: "an unexpected Error happened" });
  }
};

export const collectReward = async (req: Request, res: Response) => {
  const notificationId = req.params.id;
  const currentUserId = req.currentUser._id;

  try {
    const notify = await Notification.findById(notificationId);

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
    return res
      .status(404)
      .json({ error: "can't collect a Reward, an error occurred" });
  }
};
