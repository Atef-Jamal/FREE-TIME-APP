import express from "express";
import protectedRoute from "../middleware/index.js";
import { getAllTestimonials, createTestimonial } from "../controllers/testimonialController.js";

const router = express.Router();

router.get("/", getAllTestimonials);
router.post("/", protectedRoute, createTestimonial);

export default router;
