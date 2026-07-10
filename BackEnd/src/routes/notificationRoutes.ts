import express from "express";
import protectedRoute from "../middleware/index.js";
import {
  getNotifications,
  notificationsRead,
  getUserActivities,
  collectNotificationReward,
} from "../controllers/notificationsController.js";
const router = express.Router();

router.get("/my-notifications", protectedRoute, getNotifications);
router.get("/:id", getUserActivities);
router.get("/", protectedRoute, notificationsRead);
router.get("/collect/:id", protectedRoute, collectNotificationReward);

export default router;
