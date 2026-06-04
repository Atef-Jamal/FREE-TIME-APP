import express from "express";
import {
  getAllTasks,
  getTaskDetails,
  completingQuizApp,
  completingGuessCard,
  handleAddReview,
  publicTaskDetails,
} from "../controllers/tasksController.js";
import protectedRoute from "../middleware/index.js";
const router = express.Router();

router.get("/", getAllTasks);
router.get("/public/:id", publicTaskDetails);
router.get("/:id", getTaskDetails);
router.post("/complete-guesscard-app/:guessCardAppId", protectedRoute, completingGuessCard);
router.post("/complete-quiz-app/:quizappId", protectedRoute, completingQuizApp);
router.post("/:appId/review", protectedRoute, handleAddReview);

export default router;
