import express from "express";
import protectedRoute from "../middleware";
import { collectReward } from "../controllers/rewardController";
const router = express.Router();

router.post("/daily-reward/collect", protectedRoute, collectReward);

export default router;
