import { Request, Response } from "express";
import User from "../models/user";
import { generateNewWeekRewards } from "../utils";

export const collectReward = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser._id;
  const targetDay = Number(req.body.day);

  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const day = user.dailyReward.find((item) => item.day === targetDay);

    if (!day) {
      return res.status(404).json({ error: "an error occurred" });
    }

    const alreadyCollected = day.isCollected === true;

    if (alreadyCollected) {
      return res.status(404).json({ error: "sorry, already collected" });
    }

    const today = new Date();

    if (day.availableAt > today) {
      return res
        .status(404)
        .json({ error: "can not collect future day reward" });
    }

    if (targetDay > 7 || targetDay === 0) {
      return res.status(404).json({ error: "an error occurred" });
    }

    user.points = user.points + day.reward;
    user.dailyReward = user.dailyReward.map((item) => {
      if (item.day === day.day) {
        return { ...item, isCollected: true };
      } else {
        return item;
      }
    });

    const isAllRewardOfWeekCollected = user.dailyReward.every(
      (day) => day.isCollected === true
    );

    if (isAllRewardOfWeekCollected) {
      const lastDate =
        user.dailyReward[user.dailyReward.length - 1].availableAt;

      const newWeekRewards = generateNewWeekRewards(lastDate);

      user.week = user.week + 1;
      user.dailyReward = newWeekRewards;
    }

    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(404).json({ error: "can not collect daily Reward" });
  }
};
