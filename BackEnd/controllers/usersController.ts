import { Request, Response } from "express";
import User from "../models/user";
import Frame from "../models/frame";

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

// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     const updatedBody = req.body;
//     const updatedUser = await User.findByIdAndUpdate(userId, updatedBody, {
//       new: true,
//     });
//     if (updatedUser) {
//       return res.status(200).json(updatedUser);
//     }
//   } catch (error) {
//     return res.status(404).json({ error: "an Error occurred" });
//   }
// };

export const userVisited = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const userVisitedId = req.params.userId;
  try {
    const currentUser = await User.findById(currentUserId);
    const userVisited = await User.findById(userVisitedId);

    if (!currentUser || !userVisited) {
      return res.status(404).json({ error: "an Error occurred" });
    }

    userVisited.usersVisitedMe.push({
      _id: currentUserId,
      name: currentUser.name,
      profilPicture: currentUser.profilePicture,
      createdAt: new Date(),
    });

    await userVisited.save();
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
      }
    );

    // io.emit("user-photo-frame-changed", {
    //   belongsTo: currentUserId,
    //   frameObj: frame,
    // });

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
    // io.emit("user-photo-frame-changed", {
    //   belongsTo: currentUserId,
    //   frameObj: null,
    // });
    return res.status(200).json({ message: "suceess" });
  } catch (error) {
    return res.status(404).json({ error: "can't change your Frame" });
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
        .json({ error: "sorry, Reward is already collected" });
    }

    user.points += reward;

    const savedUser = await user.save();

    return res.status(200).json({
      points: savedUser?.points,
      dailyReward: savedUser?.dailyReward.days,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ error: "can't collect a Reward, an error occurred" });
  }
};

export const getWhoVisitMe = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (user.points < 5) {
      return res.status(404).json({ error: "your points is not Enough" });
    }

    user.points = user.points - 5;

    const savedUser = await user.save();
    return res
      .status(200)
      .json({ users: savedUser.usersVisitedMe, points: savedUser.points });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred" });
  }
};
