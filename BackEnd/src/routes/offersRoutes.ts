import express from "express";
import {
  getAllOffers,
  getOfferDetails,
  completingQuizApp,
  completingGuessCard,
  createOfferReview,
} from "../controllers/offersController.js";
import protectedRoute from "../middleware/index.js";
const router = express.Router();

router.get("/", getAllOffers);
router.get("/:id", getOfferDetails);
router.post("/complete-guesscard-app/:offerId", protectedRoute, completingGuessCard);
router.post("/complete-quiz-app/:offerId", protectedRoute, completingQuizApp);
router.post("/:offerId/review", protectedRoute, createOfferReview);

export default router;
