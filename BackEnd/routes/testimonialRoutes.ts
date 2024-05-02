import express from "express";
import protectedRoute from "../middleware";
import {
  getAllTestimonials,
  createTestimonial,
} from "../controllers/testimonialController";

const router = express.Router();

router.get("/", getAllTestimonials);
router.post("/", protectedRoute, createTestimonial);

export default router;
