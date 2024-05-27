import express from "express";
import {
  getAllApps,
  getAppDetails,
  completingQuizApp,
  completingGuessCard,
  handleAddReview,
} from "../controllers/appsController";
import protectedRoute from "../middleware";
const router = express.Router();

router.get("/", getAllApps);
router.get("/:id", protectedRoute, getAppDetails);
router.post(
  "/complete-guesscard-app/:guessCardAppId",
  protectedRoute,
  completingGuessCard
);
router.post("/complete-quiz-app/:quizappId", protectedRoute, completingQuizApp);
router.post("/:appId/review", protectedRoute, handleAddReview);

export default router;
