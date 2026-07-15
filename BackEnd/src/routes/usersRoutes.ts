import express from "express";
import {
  getLiveStatsUsers,
  getUser,
  changeUserPhotoFrame,
  getWhoViewMyProfile,
  profileViewed,
  getOnlineUsersData,
  getLeaderboardUsers,
  getTopUser,
  getOnlineGuestsCount,
} from "../controllers/usersController.js";
import protectedRoute from "../middleware/index.js";
const router = express.Router();

router.get("/live-stats-users", getLiveStatsUsers);
router.get("/top-user", getTopUser);
router.get("/onlines", getOnlineUsersData);
router.get("/guestsCount", getOnlineGuestsCount);
router.get("/users-leaderboard", getLeaderboardUsers);
router.get("/select-unselect-photoFrame/:frameId", protectedRoute, changeUserPhotoFrame);
router.get("/profile-views", protectedRoute, getWhoViewMyProfile);
router.get("/:userId/view-profile", protectedRoute, profileViewed);
router.get("/:userId", getUser);

export default router;
