import { Request, Response } from "express";
import Notification from "../models/notification";
import User from "../models/user";

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const allNotifications = await Notification.find({
      belongsTo: userId,
    }).populate("referredUser", "-password");
    return res.status(200).json(allNotifications);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "server - can not get user Activities" });
  }
};

export const getNotification = async (req: Request, res: Response) => {
  const userid = req.user._id;
  try {
    const notifications = await Notification.find({
      belongsTo: userid,
    }).populate(["mentionedUser", "referredUser", "frame"]);

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ error: "server - can not get notification" });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  const requestBody = req.body;
  try {
    const notification = new Notification(requestBody);

    if (!notification) {
      return res.status(404).json({ error: "can not create notification" });
    }

    return res.status(200).json(notification);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ error: "server - can not set notification" });
  }
};

export const markAsReaded = async (req: Request, res: Response) => {
  const userid = req.user._id;

  try {
    const notifications = await Notification.updateMany(
      { belongsTo: userid },
      { isRead: true }
    );

    if (!notifications) {
      return res
        .status(404)
        .json({ error: "can not mark notification as Readed" });
    }

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ error: "server - can not get notification" });
  }
};

export const updateNotify = async (req: Request, res: Response) => {
  try {
    const bodyContent = req.body;
    const notifyId = req.params.id;
    const updated = await Notification.findByIdAndUpdate(
      notifyId,
      bodyContent,
      { new: true }
    );
    return res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "server - can not update notify" });
  }
};

export const collectReward = async (req: Request, res: Response) => {
  const notificationId = req.params.id;
  const currentUserId = req.user._id;

  try {
    const notify = await Notification.findById(notificationId);

    if (!notify) {
      return res.status(404).json({ error: "Not Found" });
    }
    const isCollectedBefore = notify.isCollected;

    if (isCollectedBefore) {
      return res.status(404).json({ error: "sorry, Reward Already collected" });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $inc: { points: notify.prize },
    });

    notify.isCollected = true;

    const saveNotify = await notify.save();

    return res.status(200).json(saveNotify);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "can not collect a Reward, an error occurred" });
  }
};
