import express from "express";
const router = express.Router();
import { getAllFrames, buyFrame } from "../controllers/framesController";
import protectedRoute from "../middleware";

router.get("/", getAllFrames);
router.get("/:frameId", protectedRoute, buyFrame);

export default router;
