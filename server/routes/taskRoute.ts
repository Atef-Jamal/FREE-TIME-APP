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
router.get("/completeguesscardtask/:gameId", protectedRoute, completingGame);
router.post("/completingtask/:taskId", protectedRoute, completingTask);

export default router;
