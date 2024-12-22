import { Request, Response } from "express";
import User from "../models/user";
import Frame from "../models/frame";
import ProfileVisits from "../models/profileVisits";

export const allUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string);
  const limit = 20;
  const skip = (page - 1) * limit;
  try {
    let users;
    if (page) {
      users = await User.find()
        .skip(skip)
        .limit(limit)
        .select("-password -email");
    } else {
      users = await User.find().select("-password -email -usersVisitedMe");
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json({ error: "Can't Load all peoples" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select(
      "-password -email -usersVisitedMe"
    );

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
      visiter: currentUserId,
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
      }
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

    const visiters = await ProfileVisits.find({
      visited: currentUserId,
    }).populate("visiter", "_id name profilePicture activeFrame");

    const savedUser = await user.save();

    return res.status(200).json({ users: visiters, points: savedUser.points });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};
