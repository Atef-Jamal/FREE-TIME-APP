/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { generateNewWeekRewards } from "../utils";
import User from "../models/user";

export const collectRewardController = async (req: Request, res: Response) => {
  const targetDay = Number(req.body.day);
  try {
    const day = req.user.dailyReward.find((item: any) => item.day === targetDay);

    if (!day) {
      return res.status(404).json({ error: "an error occurred" });
    }

    const alreadyCollected = day.isCollected === true;

    if (alreadyCollected) {
      return res.status(404).json({ error: "sorry, already collected" });
    }

    const today = new Date();

    if (day.availableAt > today) {
      return res.status(404).json({ error: "can not collect future day reward" });
    }

    if (targetDay > 7 || targetDay === 0) {
      return res.status(404).json({ error: "an error occurred" });
    }

    const updatedDailyRewards = req.user.dailyReward.map((item: any) => {
      if (item.day === day.day) {
        return { ...item, isCollected: true };
      } else {
        return item;
      }
    });

    let updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: day.reward },
        dailyReward: updatedDailyRewards,
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "can't collect reward" });
    }

    const isAllRewardOfWeekCollected = updatedUser.dailyReward.every((day) => day.isCollected === true);

    if (isAllRewardOfWeekCollected) {
      const lastDate = updatedUser.dailyReward[updatedUser.dailyReward.length - 1].availableAt;

      const newWeekRewards = generateNewWeekRewards(lastDate);
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $inc: { week: 1 },
          dailyReward: newWeekRewards,
        },
        { new: true },
      );
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(404).json({ error: "can not collect daily Reward" });
  }
};
