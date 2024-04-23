import express from "express";
import {
  allUsers,
  getUser,
  updateUser,
  changeUserPhotoFrame,
  unselectUserPhotoFrame,
  collectDailyReward,
  getWhoVisitMe,
  userVisited,
} from "../controllers/users";
import protectedRoute from "../middleware";
const router = express.Router();

router.get("/", allUsers);
router.get("/changephotoframe/:frameId", protectedRoute, changeUserPhotoFrame);
router.get("/unselectuserphotoframe", protectedRoute, unselectUserPhotoFrame);
router.get("/:userId", getUser);
router.get("/who-visit-me/me", protectedRoute, getWhoVisitMe);
router.patch("/:userId", protectedRoute, updateUser);
router.patch("/:userId/visited", protectedRoute, userVisited);
router.post("/collectdailyreward", protectedRoute, collectDailyReward);

export default router;
