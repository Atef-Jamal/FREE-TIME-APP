import express from "express";
import protectedRoute from "../middleware/index.js";
import { collectRewardController } from "../controllers/rewardController.js";

const router = express.Router();

router.post("/daily-reward/collect", protectedRoute, collectRewardController);

export default router;
