import express from "express";
const router = express.Router();
import { getAllFrames, buyFrame } from "../controllers/framesController.js";
import protectedRoute from "../middleware/index.js";

router.get("/", getAllFrames);
router.get("/:frameId", protectedRoute, buyFrame);

export default router;
