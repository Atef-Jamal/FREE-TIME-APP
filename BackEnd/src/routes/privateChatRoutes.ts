import express from "express";
import protectedRoute from "../middleware/index.js";
import {
  getConversationMessages,
  createMessage,
  conversationIsRead,
  getUnreadConversationsCount,
  getAllConversations,
} from "../controllers/privateChatController.js";

const router = express.Router();

router.get("/", protectedRoute, getAllConversations);
router.get("/:secondUserId", protectedRoute, getConversationMessages);
router.post("/", protectedRoute, createMessage);
router.get("/unread/count", protectedRoute, getUnreadConversationsCount);
router.get("/:secondUserId/read", protectedRoute, conversationIsRead);

export default router;
