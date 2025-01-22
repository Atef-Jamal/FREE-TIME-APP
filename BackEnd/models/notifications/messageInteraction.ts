import mongoose from "mongoose";

const messageInteractionSchema = new mongoose.Schema(
  {
    type: { type: String, default: "INTERACT-WITH-MESSAGE", enum: ["INTERACT-WITH-MESSAGE"] },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    messageLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PublicMessage",
      required: true,
    },
    typeOfInteraction: {
      type: String,
      enum: ["loves", "likes", "dislikes"],
      required: true,
    },
    interactedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const MessageInteraction = mongoose.model("MessageInteraction", messageInteractionSchema);

export default MessageInteraction;
