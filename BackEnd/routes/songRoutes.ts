import express from "express";
import protectedRoute from "../middleware";
import { buySong } from "../controllers/songsController";

const router = express.Router();

router.get("/buy-song/:id", protectedRoute, buySong);

export default router;
