import express from "express";
import protectedRoute from "../middleware";
import {
  getAllPublicMessages,
  createPublicMessage,
  reactToPublicMessage,
  deletePublicMessage,
} from "../controllers/publicChatController";

const router = express.Router();

router.get("/", getAllPublicMessages);
router.post("/", protectedRoute, createPublicMessage);
router.patch("/:messageId/:fieldName", protectedRoute, reactToPublicMessage);
router.patch("/:messageId", protectedRoute, deletePublicMessage);

export default router;
