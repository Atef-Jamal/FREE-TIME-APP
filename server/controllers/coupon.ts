import Coupon from "../models/coupon";
import { Request, Response } from "express";
import User from "../models/user";

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findOne({});

    if (!coupon) {
      return res
        .status(404)
        .json({ error: "server - no coupons available right now" });
    }
    return res.status(200).json(coupon);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "server - can not get coupon" });
  }
};

export const applyCoupon = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { code } = req.body;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res
        .status(404)
        .json({ error: "an Error Occurred, User must be Log In" });
    }

    if (code.trim() === "") {
      return res.status(404).json({ error: "Enter Code" });
    }

    if (user.coupons.includes(code.toString())) {
      return res.status(404).json({
        error:
          "sorry, Already Consummed, stay up to date for upcoming Bounus code",
      });
    }

    const coupon = await Coupon.findOne({});

    if (!coupon) {
      return res.status(404).json({ error: "sorry, an Error occurred" });
    }

    if (coupon.code !== code.toString()) {
      return res.status(404).json({ error: "sorry, Invalid code" });
    }

    const now = new Date();

    if (coupon.expirationDate < now) {
      return res.status(404).json({ error: "sorry, code is Expired" });
    }

    user.coupons.push(coupon.code);

    user.points += coupon.prize;

    const savedUser = await user.save();

    return res.status(200).json({ points: savedUser.points });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "an Error occurred, try again" });
  }
};

export const collectDailyReward = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { day } = req.body;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const rewardObj = user.dailyReward.days.find(
      (item: any) => item.day === day
    );

    if (!rewardObj) {
      return res.status(404).json({ error: "an error occurred" });
    }
    const isCollectedBefore = rewardObj.isCollected;

    if (isCollectedBefore) {
      return res
        .status(404)
        .json({ error: "sorry, Reward is Already collected" });
    }

    const filteredArray = user.dailyReward.days.filter(
      (item: any) => item.day !== day
    );
    filteredArray.push({ day, isCollected: true, reward: 50 });
    filteredArray.sort((a: any, b: any) => a.day - b.day);
    user.dailyReward = { ...user.dailyReward, days: filteredArray };

    user.points += day * 50;
    const savedUser = await user.save();

    return res.status(200).json({
      points: savedUser.points,
      dailyReward: savedUser.dailyReward,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ error: "can not collect daily Reward, an error occurred" });
  }
};
