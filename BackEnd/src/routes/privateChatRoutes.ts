import express from "express";
import protectedRoute from "../middleware";
import {
  getConversationMessages,
  createMessage,
  markAsReaded,
  getUnreadConversationsCount,
  getAllConversations,
} from "../controllers/privateChatController";

const router = express.Router();

router.get("/", protectedRoute, getAllConversations);
router.get("/:secondUserId", protectedRoute, getConversationMessages);
router.post("/", protectedRoute, createMessage);
router.get("/unread/count", protectedRoute, getUnreadConversationsCount);
router.get("/:secondUserId/markAsRead", protectedRoute, markAsReaded);

export default router;
