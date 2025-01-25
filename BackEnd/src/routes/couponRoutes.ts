import express from "express";
import protectedRoute from "../middleware";
import { getCoupon, applyCoupon } from "../controllers/couponController";

const router = express.Router();

router.get("/", protectedRoute, getCoupon);
router.post("/", protectedRoute, applyCoupon);

export default router;
