import express from "express";
import {
  getAllTasks,
  getTaskDetails,
  completingQuizApp,
  completingGuessCard,
  handleAddReview,
  publicTaskDetails,
} from "../controllers/tasksController";
import protectedRoute from "../middleware";
const router = express.Router();

router.get("/", getAllTasks);
router.get("/public/:id", publicTaskDetails);
router.get("/:id", getTaskDetails);
router.post("/complete-guesscard-app/:guessCardAppId", protectedRoute, completingGuessCard);
router.post("/complete-quiz-app/:quizappId", protectedRoute, completingQuizApp);
router.post("/:appId/review", protectedRoute, handleAddReview);

export default router;
