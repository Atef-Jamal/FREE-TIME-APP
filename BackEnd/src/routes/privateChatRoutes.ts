import express from "express";
import protectedRoute from "../middleware";
import {
  getConversationMessages,
  createMessage,
  markAsReaded,
  getAllUnReadedMessages,
  getAllConversations,
} from "../controllers/privateChatController";

const router = express.Router();

router.get("/", protectedRoute, getAllConversations);
router.get("/:secondUserId", protectedRoute, getConversationMessages);
router.post("/", protectedRoute, createMessage);
router.get("/all/all-unreaded-count", protectedRoute, getAllUnReadedMessages);
router.get("/:secondUserId/mark-as-read", protectedRoute, markAsReaded);

export default router;
