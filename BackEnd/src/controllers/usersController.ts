import { Request, Response } from "express";
import User from "../models/user";
import Frame from "../models/frame";
import ProfileVisits from "../models/profileVisits";
import { onLineUsers } from "../socketIo/socketIo";
import { Types } from "mongoose";

export const allUsers = async (req: Request, res: Response) => {
  const pageParam = Number(req.query.pageParam) || 1;
  const limit = 20;
  const skip = (pageParam - 1) * limit;
  const onlines = Object.keys(onLineUsers).filter((item) => Types.ObjectId.isValid(item));

  try {
    const fetchOnlineUsers = await User.find({ _id: { $in: onlines } })
      .sort({ points: -1, emailVerified: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id name points profilePicture activeFrame emailVerified");

    const users = await User.find({ _id: { $nin: onlines } })
      .sort({ points: -1, emailVerified: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id name points profilePicture activeFrame emailVerified");

    const findUserHighestPoints = await User.findOne()
      .sort({ points: -1, emailVerified: -1, createdAt: -1 })
      .limit(1)
      .select("_id");

    const userHighestPoints = findUserHighestPoints?._id;
    const counts = await User.countDocuments();
    const hasMore = pageParam * limit < counts;

    return res.status(200).json({
      users: [...fetchOnlineUsers, ...users],
      userHighestPoints,
      hasMore,
    });
  } catch (error) {
    return res.status(404).json({ error: "Can't Load all peoples" });
  }
};

export const getOnlineUsers = async (req: Request, res: Response) => {
  const onlines = Object.keys(onLineUsers).filter((id) => id !== req.currentUser._id.toString());

  try {
    const users = await User.find({ _id: { $in: onlines } })
      .sort({ points: -1, createdAt: 1 })
      .select("_id name");

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
      .sort({ points: -1, emailVerified: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id name points profilePicture");

    const allDataLength = await User.countDocuments();
    return res.status(200).json({ users, allDataLength });
  } catch (error) {
    return res.status(404).json({ error: "Can't Load all peoples" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password -email -usersVisitedMe");

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    const populatedUser = await user.populate("myFrames");

    return res.status(200).json(populatedUser);
  } catch (error) {
    return res.status(404).json({
      error: "somthing went wrong ",
    });
  }
};

export const userVisited = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
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
  const currentUserId = req.currentUser._id;
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
  const currentUserId = req.currentUser._id;
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
  const currentUserId = req.currentUser._id;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (user.points < 5) {
      return res.status(404).json({ error: "your points is not Enough" });
    }

    user.points = user.points - 5;

    const visitors = await ProfileVisits.find({
      visited: currentUserId,
    }).populate("visitor", "_id name profilePicture activeFrame");

    const savedUser = await user.save();

    return res.status(200).json({ users: visitors, points: savedUser.points });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};
