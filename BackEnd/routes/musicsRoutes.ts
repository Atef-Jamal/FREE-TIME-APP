import express from "express";
import protectedRoute from "../middleware";
import { buyMusic } from "../controllers/musicsController";

const router = express.Router();

router.get("/buy-song/:id", protectedRoute, buyMusic);

export default router;
