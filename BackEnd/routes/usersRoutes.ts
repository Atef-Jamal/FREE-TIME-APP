import express from "express";
import {
  allUsers,
  getUser,
  changeUserPhotoFrame,
  unselectUserPhotoFrame,
  getWhoVisitMe,
  userVisited,
  getOnlineUsers,
  getLeaderboardUsers,
} from "../controllers/usersController";
import protectedRoute from "../middleware";
const router = express.Router();

router.get("/live-stats-users", allUsers);
router.get("/onlines", protectedRoute, getOnlineUsers);
router.get("/users-leaderboard", getLeaderboardUsers);
router.get("/select-myphoto-frame/:frameId", protectedRoute, changeUserPhotoFrame);
router.get("/unselect-myphoto-frame", protectedRoute, unselectUserPhotoFrame);
router.get("/:userId", getUser);
router.get("/who-visit-me/me", protectedRoute, getWhoVisitMe);
router.patch("/:userId/visited", protectedRoute, userVisited);

export default router;
