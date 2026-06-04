import { onLineUsers } from "../socketIo/index.js";
import { userExcludedFields } from "../constants/index.js";
import User from "../models/userModel.js";
import { io } from "../app.js";
import { redisClient } from "../lib/redis.js";
import { Types } from "mongoose";
import NotificationModel from "../models/notificationModel.js";
import PublicMessageModel from "../models/publicMessageModel.js";

export const sendRewardToUser = async (referrerUser: Types.ObjectId, newUserId: Types.ObjectId) => {
  const existedUser = await User.findById(referrerUser);
  if (!existedUser) throw new Error("Referrer user not found");

  const newNotification = await NotificationModel.create({
    type: "REFERRER",
    belongsTo: referrerUser,
    metadata: {
      isCollected: false,
      referredUser: newUserId,
      prize: 100,
    },
  });

  const populatedNotification = await NotificationModel.findById(newNotification._id).populate(
    "metadata.referredUser",
    userExcludedFields,
  );

  await redisClient.del(`notifications:list:${referrerUser}`);

  const newMessage = await PublicMessageModel.create({
    type: "FREETIME",
    typeOfTask: "REFERRER",
    sender: referrerUser,
    newUserReferred: newUserId,
  });
  const populatedMessage = await PublicMessageModel.findById(newMessage._id).populate([
    { path: "sender", select: userExcludedFields },
    { path: "newUserReferred", select: userExcludedFields },
  ]);

  io.to(onLineUsers[referrerUser.toString()]).emit("new-notification", populatedNotification);
  io.emit("public-message", populatedMessage);
};
