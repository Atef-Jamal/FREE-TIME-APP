import express from "express";
import protectedRoute from "../middleware";
import {
  getAllPublicMessages,
  createPublicMessage,
  reactToPublicMessage,
  getSingleMessage,
  deletePublicMessage,
} from "../controllers/publicChatController";

const router = express.Router();

router.get("/", getAllPublicMessages);
router.post("/", protectedRoute, createPublicMessage);
router.get("/:messageId/:fieldName", protectedRoute, reactToPublicMessage);
router.get("/:messageId", protectedRoute, getSingleMessage);
router.delete("/:messageId", protectedRoute, deletePublicMessage);

export default router;
