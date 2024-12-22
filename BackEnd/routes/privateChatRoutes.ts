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

router.get("/:seconduserid", protectedRoute, getConversationMessages);
router.post("/:seconduserid", protectedRoute, createMessage);
router.get("/all-conversations/allusers", protectedRoute, getAllConversations);
router.get("/all/all-unreaded-count", protectedRoute, getAllUnReadedMessages);
router.patch("/:seconduserid", protectedRoute, markAsReaded);

export default router;
