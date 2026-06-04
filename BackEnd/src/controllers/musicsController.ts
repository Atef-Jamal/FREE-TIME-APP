import { Request, Response } from "express";
import User from "../models/userModel.js";
import { io } from "../app.js";
import { onLineUsers } from "../socketIo/index.js";
import { userExcludedFields } from "../constants/index.js";
import { redisClient } from "../lib/redis.js";
import NotificationModel from "../models/notificationModel.js";
import PublicMessageModel from "../models/publicMessageModel.js";

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
    await redisClient.set(cacheKey, JSON.stringify(data.data));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error: "can't load musics." });
  }
};

export const buyMusic = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
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

    const updatedUserPromise = User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: -10 },
        mySongs: [...req.user.mySongs, musicId],
      },
      { new: true },
    );

    const newNotificationPromise = NotificationModel.create({
      type: "MUSIC",
      belongsTo: req.user._id,
      metadata: {
        price: 10,
        musicTitle,
        musicId: musicId,
      },
    });

    const newPublicMessagePromise = PublicMessageModel.create({
      type: "FREETIME",
      typeOfTask: "MUSIC",
      sender: req.user._id,
      musicTitle,
    });

    const [updatedUser, newNotification, newPublicMessage] = await Promise.all([
      updatedUserPromise,
      newNotificationPromise,
      newPublicMessagePromise,
      redisClient.del(`notifications:list:${req.user._id.toString()}`),
    ]);

    if (!updatedUser) return res.status(404).json({ error: "an error occurred" });

    const populatedPublicMessage = await PublicMessageModel.findById(newPublicMessage._id).populate(
      "sender",
      userExcludedFields,
    );

    io.to(onLineUsers[req.user._id.toString()]).emit("new-notification", newNotification);
    io.emit("public-message", populatedPublicMessage);

    return res.status(200).json({ points: updatedUser.points, musicId });
  } catch (error) {
    return res.status(404).json({ error: "can't buy this Musics, try again" });
  }
};
