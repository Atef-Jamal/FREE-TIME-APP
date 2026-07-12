import { Request, Response } from "express";
import Frame from "../models/frame.js";
import User from "../models/user.js";
import { io } from "../app.js";
import { userExcludedFields } from "../constants/index.js";
import { redisClient } from "../lib/redis.js";
import Notification from "../models/notification.js";
import PublicMessage from "../models/publicMessage.js";

export const getAllFrames = async (_: Request, res: Response) => {
  try {
    const allFrames = await Frame.find({});
    return res.status(200).json(allFrames);
  } catch (error) {
    return res.status(404).json({ error: "can't get Load Frames" });
  }
};

export const buyFrame = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { frameId } = req.params;

  try {
    const frame = await Frame.findById(frameId);

    if (!frame) return res.status(404).json("Frame not found");

    if (req.user.points < frame.price) {
      return res.status(404).json({ error: "sorry, your points is not Enough" });
    }

    if (req.user.myFrames.includes(frame._id)) {
      return res.status(404).json({ error: "Already buyed Before, try with another" });
    }

    const updatedUserPromise = User.findByIdAndUpdate(
      req.user._id,
      {
        points: req.user.points - frame.price,
        $push: { myFrames: frame._id },
      },
      { returnDocument: "after" },
    )
      .populate("activeFrame")
      .lean();

    const updatedFramePromise = Frame.findByIdAndUpdate(
      frame._id,
      {
        $push: { purshasedBy: req.user._id },
      },
      { returnDocument: "after" },
    ).lean();

    const newNotificationPromise = Notification.create({
      type: "BUY-FRAME",
      belongsTo: req.user._id,
      metadata: {
        frame: frame._id,
        price: frame.price,
      },
    });

    const newPublicMessagePromise = PublicMessage.create({
      type: "FREETIME",
      typeOfTask: "FRAME",
      sender: req.user._id,
    });

    const [updatedUser, updatedFrame, newNotification, newPublicMessage] = await Promise.all([
      updatedUserPromise,
      updatedFramePromise,
      newNotificationPromise,
      newPublicMessagePromise,
    ]);

    if (!updatedUser || !updatedFrame) return res.status(404).json({ error: "an error occurred" });

    const populatedNotificationPromise = Notification.findById(newNotification._id)
      .populate("metadata.frame")
      .lean();

    const populatedPublicMessagePromise = PublicMessage.findById(newPublicMessage._id)
      .populate("sender", userExcludedFields)
      .lean();

    const [populatedNotification, populatedPublicMessage] = await Promise.all([
      populatedNotificationPromise,
      populatedPublicMessagePromise,
      redisClient.del(`notifications:list:${req.user._id.toString()}`),
    ]);
    if (populatedPublicMessage) io.emit("public_chat_message", populatedPublicMessage);
    io.emit("user_updated", updatedUser);
    return res
      .status(200)
      .json({ points: updatedUser.points, frame: updatedFrame, notification: populatedNotification });
  } catch (error) {
    return res.status(404).json({ error: "can't buy Frame, an error occured" });
  }
};
