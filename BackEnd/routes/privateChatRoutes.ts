import express from "express";
import protectedRoute from "../middleware";
import {
  getConversationMessages,
  createMessage,
  markAsReaded,
  getRecentMessage,
  getUnReadedMsgsCount,
  getAllUnReadedMessages,
  getAllConversations,
} from "../controllers/privateChatController";

const router = express.Router();

router.get("/:seconduserid", protectedRoute, getConversationMessages);
router.post("/:seconduserid", protectedRoute, createMessage);
router.get("/recentmessage/:seconduserid", protectedRoute, getRecentMessage);
router.get(
  "/unreadedcount/:seconduserid",
  protectedRoute,
  getUnReadedMsgsCount
);
router.get("/all-conversations/allusers", protectedRoute, getAllConversations);
router.get("/all/all-unreaded-count", protectedRoute, getAllUnReadedMessages);
router.patch("/:seconduserid", protectedRoute, markAsReaded);

export default router;
