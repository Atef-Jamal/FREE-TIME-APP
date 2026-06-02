import { Request, Response } from "express";
import User from "../models/user";
import Frame from "../models/frame";
import ProfileVisits from "../models/profileVisits";
import { userExcludedFields } from "../constants";
import { redisClient } from "../lib/redis";

export const allUsers = async (req: Request, res: Response) => {
  const pageParam = Number(req.query.pageParam) || 1;
  let limit = 20;
  const skip = (pageParam - 1) * limit;

  try {
    let users = await User.find({ isOnline: true })
      .sort({ isOnline: -1, points: -1, emailVerified: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(userExcludedFields);

    if (users.length < limit) {
      limit = limit - users.length;
      const excludedIds = users.map((u) => u._id);

      const moreUsers = await User.find({ _id: { $nin: excludedIds } })
        .sort({ isOnline: -1, points: -1, emailVerified: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(userExcludedFields);

      users = [...users, ...moreUsers];
    }

    const findUserHighestPoints = await User.findOne()
      .sort({ isOnline: 1, points: -1, emailVerified: 1, createdAt: -1 })
      .limit(1)
      .select("_id");

    const hasMore = pageParam * limit <= users.length;

    return res.status(200).json({
      users,
      userHighestPoints: findUserHighestPoints?._id,
      hasMore,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Can't Load all peoples" });
  }
};

export const getOnlineUsers = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  try {
    const users = await User.find({ _id: { $ne: currentUserId }, isOnline: true })
      .sort({ points: -1, createdAt: 1 })
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

    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));
    }

    const user = await User.findById(userId).select(userExcludedFields).populate("myFrames");

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    await redisClient.set(userCacheKey, JSON.stringify(user));

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({
      error: "somthing went wrong ",
    });
  }
};

export const userVisited = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const userVisitedId = req.params.userId;
  try {
    const userVisited = await User.findById(userVisitedId);

    if (!userVisited) {
      return res.status(404).json({ error: "user not found" });
    }
    const newVisit = new ProfileVisits({
      visited: userVisitedId,
      visitor: currentUserId,
    });

    await newVisit.save();
    return res.status(200).json({ message: "sucess" });
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred" });
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
      },
    );

    return res.status(200).json(frame);
  } catch (error) {
    return res.status(404).json({ error: "can't change your Frame" });
  }
};

export const unselectUserPhotoFrame = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  try {
    await User.findByIdAndUpdate(currentUserId, {
      activeFrame: null,
    });
    return res.status(200).json({ message: "suceess" });
  } catch (error) {
    return res.status(404).json({ error: "can't change your Frame" });
  }
};

export const getWhoVisitMe = async (req: Request, res: Response) => {
  try {
    if (req.user.points < 5) {
      return res.status(404).json({ error: "your points is not Enough" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: -5 },
      },
      { new: true },
    );

    if (!user) return res.status(404).json({ error: "an error occurred" });

    const visitors = await ProfileVisits.find({
      visited: req.user._id,
    }).populate("visitor", userExcludedFields);

    return res.status(200).json({ users: visitors, points: user.points });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};
