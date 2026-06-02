import express from "express";
import protectedRoute from "../middleware";
import { buyMusic, getMusics } from "../controllers/musicsController";

const router = express.Router();

router.get("/", getMusics);
router.post("/buy-musics/:id", protectedRoute, buyMusic);

export default router;
