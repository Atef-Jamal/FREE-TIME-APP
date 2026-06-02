import express from "express";
import protectedRoute from "../middleware";
import { collectRewardController } from "../controllers/rewardController";

const router = express.Router();

router.post("/daily-reward/collect", protectedRoute, collectRewardController);

export default router;
