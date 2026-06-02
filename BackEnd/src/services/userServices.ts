import { onLineUsers } from "../socketIo";
import Notification from "../models/notification";
import { userExcludedFields } from "../constants";
import User from "../models/user";
import { io } from "../app";
import PublicMessage from "../models/publicMessage";
import { redisClient } from "../lib/redis";

export const sendRewardToUser = async (referrerUser: string, currentNewUserId: string) => {
  const existedUser = await User.findById(referrerUser);
  if (!existedUser) throw new Error("Referrer user not found");

  const createNotification = new Notification({
    type: "REFERRER",
    belongsTo: referrerUser,
    metadata: {
      isCollected: false,
      referredUser: currentNewUserId,
      prize: 100,
    },
  });
  const saveNotification = await createNotification.save();

  await redisClient.del(`notifications:list:${referrerUser}`);

  const savedNotification = await saveNotification.populate("metadata.referredUser", userExcludedFields);

  const createPublicMessage = new PublicMessage({
    type: "FREETIME",
    typeOfTask: "REFERRER",
    sender: referrerUser,
    newUserReferred: currentNewUserId,
  });
  const saveMessage = await createPublicMessage.save();
  const savedMessage = await saveMessage.populate([
    { path: "sender", select: userExcludedFields },
    { path: "newUserReferred", select: userExcludedFields },
  ]);
  io.emit("public-message", savedMessage);
  io.to(onLineUsers[referrerUser.toString()]).emit("new-notification", savedNotification);
};
