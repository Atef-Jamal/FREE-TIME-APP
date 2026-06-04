import express from "express";
import protectedRoute from "../middleware/index.js";
import {
  getNotifications,
  markAsReaded,
  getUserActivities,
  collectNotificationReward,
} from "../controllers/notificationsController.js";
const router = express.Router();

router.get("/my-notifications", protectedRoute, getNotifications);
router.get("/:id", getUserActivities);
router.patch("/", protectedRoute, markAsReaded);
router.get("/collect/:id", protectedRoute, collectNotificationReward);

export default router;
