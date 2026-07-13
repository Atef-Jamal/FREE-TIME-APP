import { Request, Response } from "express";
import User from "../models/user.js";
import Frame from "../models/frame.js";
import ProfileView from "../models/ProfileView.js";
import { userExcludedFields } from "../constants/index.js";
import { redisClient } from "../lib/redis.js";
import { onlineUsers, io } from "../app.js";
import { Types } from "mongoose";

export const getLiveStatsUsers = async (req: Request, res: Response) => {
  const pageParam = Number(req.query.pageParam) || 1;
  const limit = 20;
  const skip = (pageParam - 1) * limit;

  try {
    const users = await User.find({})
      .sort({ isOnline: -1, points: -1, emailVerified: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(userExcludedFields)
      .populate("activeFrame", "image");

    const hasMore = limit === users.length;
    return res.status(200).json({ users, hasMore });
  } catch (error) {
    return res.status(404).json({ error: "Can't Load Live stats" });
  }
};

export const getOnlineUsersData = async (_req: Request, res: Response) => {
  try {
    const usersIds = [...onlineUsers.keys()];
    const users = await User.find({ _id: { $in: usersIds } })
      .sort({ isOnline: -1, points: -1, emailVerified: 1, createdAt: 1 })
      .select(userExcludedFields);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json({ error: "Can't Load online users data" });
  }
};

export const getLeaderboardUsers = async (req: Request, res: Response) => {
  const pageParam = Number(req.query.pageParam) || 1;
  const limit = 100;
  const skip = (pageParam - 1) * limit;
  try {
    const users = await User.find({})
      .sort({ points: -1, emailVerified: 1, isOnline: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(userExcludedFields);

    const allDataLength = await User.countDocuments();
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

    const user = await User.findById(userId)
      .select(userExcludedFields)
      .populate([{ path: "myFrames" }, { path: "activeFrame" }]);

    if (!user) return res.status(404).json({ error: "User Not Found" });

    await redisClient.set(userCacheKey, JSON.stringify(user));

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({
      error: "somthing went wrong",
    });
  }
};

export const getTopUser = async (_req: Request, res: Response) => {
  try {
    const user = await User.findOne({}).sort({ points: -1, emailVerified: 1, createdAt: -1 }).select("_id");
    if (!user) return res.status(404).json({ error: "User Not Found" });
    return res.status(200).json({ userId: user._id });
  } catch (error) {
    return res.status(404).json({ error: "somthing went wrong " });
  }
};

export const changeUserPhotoFrame = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { frameId } = req.params;
  const action = req.query.action as "select" | "unselect";
  try {
    const frame = await Frame.findById(frameId).lean();
    if (!frame) return res.status(404).json({ error: "Frame Not Found" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(action === "select" ? { activeFrame: frame._id } : {}),
        ...(action === "unselect"
          ? {
              $unset: {
                activeFrame: "",
              },
            }
          : {}),
      },
      { returnDocument: "after" },
    )
      .populate("activeFrame")
      .lean();

    if (updatedUser) {
      await redisClient.del(`users:details:${req.user._id.toString()}`);
      io.emit("user_updated", updatedUser);
    }

    return res.status(200).json(frame);
  } catch (error) {
    return res.status(404).json({ error: "can't change your Frame" });
  }
};

export const profileViewed = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const targetUserId = req.params.userId;
  try {
    const user = await User.findById(targetUserId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.user._id.toString() !== targetUserId.toString()) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentView = await ProfileView.findOne({
        viewer: req.user._id,
        profileOwner: targetUserId,
        viewedAt: { $gte: oneHourAgo },
      });

      if (!recentView) {
        await ProfileView.create({
          viewer: req.user._id,
          profileOwner: new Types.ObjectId(targetUserId),
        });
        return res.status(200).json({ message: "sucess" });
      }
    }
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred" });
  }
};

export const getWhoViewMyProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  try {
    if (req.user.points < 5) return res.status(404).json({ error: "your points is not Enough" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: -5 },
      },
      { returnDocument: "after" },
    ).lean();

    if (!user) return res.status(404).json({ error: "an error occurred" });

    const viewers = await ProfileView.find({
      profileOwner: req.user._id,
    })
      .populate("viewer", "_id name profilePicture")
      .lean();

    return res.status(200).json({ viewers: viewers, points: user.points });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};
