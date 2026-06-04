import express from "express";
import protectedRoute from "../middleware/index.js";
import { getCoupon, applyCoupon } from "../controllers/couponController.js";

const router = express.Router();

router.get("/", protectedRoute, getCoupon);
router.post("/", protectedRoute, applyCoupon);

export default router;
