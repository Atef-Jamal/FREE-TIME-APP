import express from "express";
import {
  getAllTasks,
  getSingaleTask,
  completingQuizApp,
  completingGuessCard,
} from "../controllers/tasks";
import protectedRoute from "../middleware";
const router = express.Router();

router.get("/", getAllTasks);
router.get("/:id", protectedRoute, getSingaleTask);
router.post(
  "/completeguesscardtask/:guessCardAppId",
  protectedRoute,
  completingGuessCard
);
router.post(
  "/completingquizapptask/:quizappId",
  protectedRoute,
  completingQuizApp
);

export default router;
