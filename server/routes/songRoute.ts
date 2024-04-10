import express from "express";
import protectedRoute from "../middleware";
import { buySong } from "../controllers/songs";

const router = express.Router();

router.post("/buysong/:id", protectedRoute, buySong);

export default router;
