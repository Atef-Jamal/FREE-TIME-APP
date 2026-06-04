import express from "express";
import protectedRoute from "../middleware/index.js";
import { buyMusic, getMusics } from "../controllers/musicsController.js";

const router = express.Router();

router.get("/", getMusics);
router.post("/buy-musics/:id", protectedRoute, buyMusic);

export default router;
