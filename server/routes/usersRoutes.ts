import express from "express";
import {
  allUsers,
  getUser,
  updateUser,
  changeUserPhotoFrame,
  unselectUserPhotoFrame,
  getWhoVisitMe,
  userVisited,
} from "../controllers/usersController";
import protectedRoute from "../middleware";
const router = express.Router();

router.get("/", allUsers);
router.get(
  "/change-photo-frame/:frameId",
  protectedRoute,
  changeUserPhotoFrame
);
router.get("/unselect-user-photoframe", protectedRoute, unselectUserPhotoFrame);
router.get("/:userId", getUser);
router.get("/who-visit-me/me", protectedRoute, getWhoVisitMe);
router.patch("/:userId", protectedRoute, updateUser);
router.patch("/:userId/visited", protectedRoute, userVisited);

export default router;
