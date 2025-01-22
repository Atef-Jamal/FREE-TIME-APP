import express from "express";
import protectedRoute from "../middleware";
import {
  getNotifications,
  markAsReaded,
  getUserActivities,
  collectReward,
} from "../controllers/notificationsController";
const router = express.Router();

router.get("/my-notifications", protectedRoute, getNotifications);
router.get("/:id", getUserActivities);
router.patch("/", protectedRoute, markAsReaded);
router.patch("/collect/:id/:modelName", protectedRoute, collectReward);

export default router;
