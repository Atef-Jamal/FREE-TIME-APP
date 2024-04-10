import express from "express";
import protectedRoute from "../middleware";
import {
  getNotification,
  createNotification,
  markAsReaded,
  updateNotify,
  getUserActivities,
  collectReward,
} from "../controllers/notification";
const router = express.Router();

router.get("/:id", getUserActivities);
router.get("/", protectedRoute, getNotification);
router.post("/", protectedRoute, createNotification);
router.patch("/", protectedRoute, markAsReaded);
router.patch("/:id", protectedRoute, updateNotify);
router.patch("/collect/:id", protectedRoute, collectReward);

export default router;
