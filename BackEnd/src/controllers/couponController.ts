import Coupon from "../models/coupon";
import { Request, Response } from "express";
import User from "../models/user";

export const getCoupon = async (_: Request, res: Response) => {
  try {
    const coupon = await Coupon.findOne({});
    if (!coupon) {
      return res.status(404).json({ error: "No coupons available right now" });
    }
    return res.status(200).json(coupon);
  } catch (error) {
    return res.status(404).json({ error: "Can not get coupon" });
  }
};

export const applyCoupon = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    if (code.trim() === "") {
      return res.status(404).json({ error: "Enter Code" });
    }

    if (req.user.coupons.includes(code.toString())) {
      return res.status(404).json({
        error: "Already Consummed, stay up to date for upcoming New Bounus code",
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

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { points: coupon.prize },
        coupons: [...req.user.coupons, coupon.code],
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "can't apply coupon, try again" });
    }

    return res.status(200).json({ points: updatedUser.points });
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred, try again" });
  }
};
