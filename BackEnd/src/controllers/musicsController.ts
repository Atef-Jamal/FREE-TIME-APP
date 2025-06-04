import { Request, Response } from "express";
import User from "../models/user";
import { io } from "../socketIo";
import PublicMessage from "../models/publicMessage";
import { onLineUsers } from "../socketIo";
import Notification from "../models/notification";
import { userExcludedFields } from "../constants";

export const buyMusic = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
  const songId = req.params.id;
  const { musicTitle } = req.body;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (10 > user.points) {
      return res.status(404).json({ error: "sorry, your points is not Enough" });
    }

    const isPurshasedBefore = user.mySongs.includes(songId);

    if (isPurshasedBefore) {
      return res.status(404).json({ error: "already purshased, try with another" });
    }

    user.points = user.points - 10;
    user.mySongs.push(songId);

    const createNotification = new Notification({
      type: "MUSIC",
      belongsTo: currentUserId,
      metadata: {
        price: 10,
        musicTitle,
        musicId: songId,
      },
    });

    const createPublicMessage = new PublicMessage({
      type: "FREETIME",
      typeOfTask: "MUSIC",
      sender: currentUserId,
      musicTitle,
    });
    const savedNotification = await createNotification.save();
    const savedPublicMessage = await createPublicMessage.save();
    const populatedMessage = await savedPublicMessage.populate("sender", userExcludedFields);
    const updatedUser = await user.save();

    io.to(onLineUsers[currentUserId]).emit("new-notification", savedNotification);
    io.emit("public-message", populatedMessage);

    return res.status(200).json({ points: updatedUser.points, musicId: songId });
  } catch (error) {
    return res.status(404).json({ error: "can't buy this Musics, try again" });
  }
};
