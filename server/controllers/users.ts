import { Request, Response } from "express";
import User from "../models/user";
import Frame from "../models/frame";
import { io } from "../server";

export const allUsers = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit);
  try {
    const users = limit
      ? await User.find({}).select("-password").limit(limit)
      : await User.find({}).select("-password");

    if (!users) {
      return res.status(404).json({ error: "failed to load all users" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "server - error all users" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const populatedUser = await user.populate("myFrames");

    return res.status(200).json(populatedUser);
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error: "server - somthing went wrong single user",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updatedBody = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updatedBody, {
      new: true,
    });
    if (updatedUser) {
      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "server - can not update user" });
  }
};

export const changeUserPhotoFrame = async (req: Request, res: Response) => {
  const { frameId } = req.params;
  const currentUserId = req.user._id;
  try {
    const frame = await Frame.findById(frameId);

    if (!frame) {
      return res.status(404).json({ error: "Frame Not Found" });
    }

    await User.findByIdAndUpdate(
      currentUserId,
      {
        activeFrame: frame,
      },
      {
        new: true,
      }
    );

    io.emit("user-photo-frame-changed", {
      belongsTo: currentUserId,
      frameObj: frame,
    });

    return res.status(200).json(frame);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "server - can not update user" });
  }
};

export const unselectUserPhotoFrame = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  try {
    await User.findByIdAndUpdate(currentUserId, {
      activeFrame: null,
    });
    io.emit("user-photo-frame-changed", {
      belongsTo: currentUserId,
      frameObj: null,
    });
    return res.status(200).json({ message: "suceess" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "server - can not update user" });
  }
};

export const collectDailyReward = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { day } = req.body;
  const reward = day * 50 + 50;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    const isCollectedBefore = user.dailyReward.days.includes(day);

    if (isCollectedBefore) {
      return res
        .status(404)
        .json({ error: "sorry, reward is already collected" });
    }

    user.points += reward;

    const savedUser = await user.save();

    return res.status(200).json({
      points: savedUser?.points,
      dailyReward: savedUser?.dailyReward.days,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "can not collect a Reward, an error occurred" });
  }
};
