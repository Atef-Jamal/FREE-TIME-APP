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

router.get("/:seconduserId", protectedRoute, getConversationMessages);
router.post("/:seconduserId", protectedRoute, createMessage);
router.get("/all-conversations/allusers", protectedRoute, getAllConversations);
router.get("/all/all-unreaded-count", protectedRoute, getAllUnReadedMessages);
router.get("/:seconduserId/mark-as-read", protectedRoute, markAsReaded);

export default router;
