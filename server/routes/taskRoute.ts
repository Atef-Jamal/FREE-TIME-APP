import express from "express";
import {
  getAllTasks,
  getSingaleTask,
  completingTask,
  completingGame,
} from "../controllers/tasks";
import protectedRoute from "../middleware";
const router = express.Router();

router.get("/", getAllTasks);
router.get("/:id", protectedRoute, getSingaleTask);
router.post(
  "/completeguesscardtask/:guessCardAppId",
  protectedRoute,
  completingGame
);
router.post(
  "/completingquizapptask/:quizappId",
  protectedRoute,
  completingTask
);

export default router;
