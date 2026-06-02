import { Request, Response } from "express";
import User from "../models/user";
import { io } from "../app";
import PublicMessage from "../models/publicMessage";
import { onLineUsers } from "../socketIo";
import Notification from "../models/notification";
import { userExcludedFields } from "../constants";
import { redisClient } from "../lib/redis";

export const buyMusic = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const musicId = req.params.id;
  const { musicTitle } = req.body;
  try {
    if (req.user.points < 10) {
      return res.status(404).json({ error: "sorry, your points is not Enough" });
    }

    const isPurshasedBefore = req.user.mySongs.includes(musicId);

    if (isPurshasedBefore) {
      return res.status(404).json({ error: "already purshased, try with another" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: -10 },
        mySongs: [...req.user.mySongs, musicId],
      },
      { new: true },
    );
    if (!updatedUser) return res.status(404).json({ error: "an error occurred" });
    const createNotification = new Notification({
      type: "MUSIC",
      belongsTo: currentUserId,
      metadata: {
        price: 10,
        musicTitle,
        musicId: musicId,
      },
    });

    const createPublicMessage = new PublicMessage({
      type: "FREETIME",
      typeOfTask: "MUSIC",
      sender: currentUserId,
      musicTitle,
    });
    const savedNotification = await createNotification.save();
    await redisClient.del(`notifications:list:${currentUserId}`);
    const savedPublicMessage = await createPublicMessage.save();
    const populatedMessage = await savedPublicMessage.populate("sender", userExcludedFields);

    io.to(onLineUsers[currentUserId]).emit("new-notification", savedNotification);
    io.emit("public-message", populatedMessage);

    return res.status(200).json({ points: updatedUser.points, musicId });
  } catch (error) {
    return res.status(404).json({ error: "can't buy this Musics, try again" });
  }
};

export const getMusics = async (_req: Request, res: Response) => {
  try {
    const cacheKey = "musics:list";
    const cachedMusics = await redisClient.get(cacheKey);

    if (cachedMusics) {
      return res.status(200).json(JSON.parse(cachedMusics));
    }
    const url = process.env.DEEZER_MUSICS_URL!;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY!,
        "X-RapidAPI-Host": process.env.X_RAPIDAPI_HOST!,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    await redisClient.set(cacheKey, JSON.stringify(data));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error: "can't load musics." });
  }
};
