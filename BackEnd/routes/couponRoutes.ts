import express from "express";
import protectedRoute from "../middleware";
import { getCoupon } from "../controllers/couponController";
import {
  applyCoupon,
  collectDailyReward,
} from "../controllers/couponController";

const router = express.Router();

router.get("/", protectedRoute, getCoupon);
router.post("/", protectedRoute, applyCoupon);
router.post("/collect-daily-reward", protectedRoute, collectDailyReward);

export default router;
