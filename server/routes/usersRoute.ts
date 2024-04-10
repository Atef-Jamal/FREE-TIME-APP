import express from "express";
import {
  allUsers,
  getUser,
  updateUser,
  changeUserPhotoFrame,
  unselectUserPhotoFrame,
  collectDailyReward,
} from "../controllers/users";
import protectedRoute from "../middleware";
const router = express.Router();

router.get("/", allUsers);
router.get("/changephotoframe/:frameId", protectedRoute, changeUserPhotoFrame);
router.get("/unselectuserphotoframe", protectedRoute, unselectUserPhotoFrame);
router.get("/:userId", getUser);
router.patch("/:userId", protectedRoute, updateUser);
router.post("/collectdailyreward", protectedRoute, collectDailyReward);

export default router;
