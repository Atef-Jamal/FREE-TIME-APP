import express from "express";
import protectedRoute from "../middleware";
import { getCoupon } from "../controllers/coupon";
import { applyCoupon, collectDailyReward } from "../controllers/coupon";

const router = express.Router();

router.get("/", protectedRoute, getCoupon);
router.post("/", protectedRoute, applyCoupon);
router.post("/collectdailyreward", protectedRoute, collectDailyReward);

export default router;
