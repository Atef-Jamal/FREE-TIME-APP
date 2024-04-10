import express from "express";
import protectedRoute from "../middleware";
import {
  getAllTestimonials,
  createTestimonial,
} from "../controllers/testimonial";

const router = express.Router();

router.get("/", getAllTestimonials);
router.post("/", protectedRoute, createTestimonial);

export default router;
