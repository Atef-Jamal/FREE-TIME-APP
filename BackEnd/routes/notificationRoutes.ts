import express from "express";
import protectedRoute from "../middleware";
import {
  getNotifications,
  createNotification,
  markAsReaded,
  getUserActivities,
  collectReward,
} from "../controllers/notificationsController";
const router = express.Router();

router.get("/my-notifications", protectedRoute, getNotifications);
router.get("/:id", getUserActivities);
router.post("/", protectedRoute, createNotification);
router.patch("/", protectedRoute, markAsReaded);
router.patch("/collect/:id", protectedRoute, collectReward);

export default router;
