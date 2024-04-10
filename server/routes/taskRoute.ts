import express from "express";
import {
  getAllTasks,
  getSingaleTask,
  completingTask,
  completingGame,
} from "../controllers/tasks";
import protectedRoute from "../middleware";
const router = express.Router();

router.get("/", getAllTasks);
router.get("/:id", protectedRoute, getSingaleTask);
router.post("/completingtask/:taskId", protectedRoute, completingTask);
router.post("/completegame/:gameId", protectedRoute, completingGame);

export default router;
