import { Request, Response } from "express";
import UserModel from "../models/userModel.js";
import FrameModel from "../models/frameModel.js";
import ProfileVisitsModel from "../models/profileVisitsModel.js";
import { userExcludedFields } from "../constants/index.js";
import { redisClient } from "../lib/redis.js";
import { Types } from "mongoose";

export const allUsers = async (req: Request, res: Response) => {
  const pageParam = Number(req.query.pageParam) || 1;
  let limit = 20;
  const skip = (pageParam - 1) * limit;

  try {
    let users = await UserModel.find({ isOnline: true })
      .sort({ isOnline: -1, points: -1, emailVerified: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(userExcludedFields);

    if (users.length < limit) {
      limit = limit - users.length;
      const excludedIds = users.map((u) => u._id);

      const moreUsers = await UserModel.find({ _id: { $nin: excludedIds } })
        .sort({ isOnline: -1, points: -1, emailVerified: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(userExcludedFields);

      users = [...users, ...moreUsers];
    }

    const hasMore = limit === users.length;

    return res.status(200).json({ users, hasMore });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Can't Load all peoples" });
  }
};

export const getOnlineUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({ _id: { $ne: req.user?._id }, isOnline: true })
      .sort({ points: -1, emailVerified: 1, isOnline: -1, createdAt: 1 })
      .select(userExcludedFields);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json({ error: "Can't Load all peoples" });
  }
};

export const getLeaderboardUsers = async (req: Request, res: Response) => {
  const pageParam = Number(req.query.pageParam) || 1;
  const limit = 100;
  const skip = (pageParam - 1) * limit;
  try {
    const users = await UserModel.find({})
      .sort({ points: -1, emailVerified: 1, isOnline: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(userExcludedFields);

    const allDataLength = await UserModel.countDocuments();
    return res.status(200).json({ users, allDataLength });
  } catch (error) {
    return res.status(404).json({ error: "Can't Load all peoples" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userCacheKey = `users:details:${userId}`;
    const cachedUser = await redisClient.get(userCacheKey);

    if (cachedUser) return res.status(200).json(JSON.parse(cachedUser));

    const user = await UserModel.findById(userId).select(userExcludedFields).populate("myFrames");

    if (!user) return res.status(404).json({ error: "User Not Found" });

    await redisClient.set(userCacheKey, JSON.stringify(user));

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({
      error: "somthing went wrong ",
    });
  }
};

export const userVisited = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const userVisitedId = req.params.userId;
  try {
    const userVisited = await UserModel.findById(userVisitedId);
    if (!userVisited) return res.status(404).json({ error: "user not found" });
    await ProfileVisitsModel.create({ visited: new Types.ObjectId(userVisitedId), visitor: req.user._id });
    return res.status(200).json({ message: "sucess" });
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred" });
  }
};

export const changeUserPhotoFrame = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { frameId } = req.params;
  try {
    const frame = await FrameModel.findById(frameId);

    if (!frame) return res.status(404).json({ error: "Frame Not Found" });

    await UserModel.findByIdAndUpdate(req.user._id, { activeFrame: frame }, { returnDocument: "after" });

    return res.status(200).json(frame);
  } catch (error) {
    return res.status(404).json({ error: "can't change your Frame" });
  }
};

export const unselectUserPhotoFrame = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  try {
    await UserModel.findByIdAndUpdate(req.user._id, { $unset: { activeFrame: "" } });
    return res.status(200).json({ message: "suceess" });
  } catch (error) {
    return res.status(404).json({ error: "can't change your Frame" });
  }
};

export const getWhoVisitMe = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  try {
    if (req.user.points < 5) return res.status(404).json({ error: "your points is not Enough" });

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: -5 },
      },
      { new: true },
    );

    if (!user) return res.status(404).json({ error: "an error occurred" });

    const visitors = await ProfileVisitsModel.find({
      visited: req.user._id,
    }).populate("visitor", userExcludedFields);

    return res.status(200).json({ users: visitors, points: user.points });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};
