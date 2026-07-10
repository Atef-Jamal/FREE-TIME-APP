import { userExcludedFields } from "../constants/index.js";
import User from "../models/user.js";
import { io, onlineUsers } from "../app.js";
import { redisClient } from "../lib/redis.js";
import { Types } from "mongoose";
import Notification from "../models/notification.js";
import PublicMessage from "../models/publicMessage.js";

export const sendRewardToUser = async (
  referrerUser: Types.ObjectId,
  newUserId: Types.ObjectId,
): Promise<void> => {
  const existedUser = await User.findById(referrerUser);
  if (!existedUser) throw new Error("Referrer user not found");

  const newNotification = await Notification.create({
    type: "REFERRER",
    belongsTo: referrerUser,
    metadata: {
      isCollected: false,
      referredUser: newUserId,
      prize: 100,
    },
  });

  const populatedNotification = await Notification.findById(newNotification._id).populate(
    "metadata.referredUser",
    userExcludedFields,
  );

  await redisClient.del(`notifications:list:${referrerUser}`);

  const newMessage = await PublicMessage.create({
    type: "FREETIME",
    typeOfTask: "REFERRER",
    sender: referrerUser,
    newUserReferred: newUserId,
    message: "referral system",
  });

  const populatedMessage = await PublicMessage.findById(newMessage._id)
    .populate([
      { path: "sender", select: userExcludedFields },
      { path: "newUserReferred", select: userExcludedFields },
    ])
    .lean();

  const targetSockets = onlineUsers.get(referrerUser.toString());

  if (targetSockets && populatedNotification) {
    io.to([...targetSockets]).emit("notification", populatedNotification);
  }

  if (populatedMessage) io.emit("public_chat_message", populatedMessage);
};
