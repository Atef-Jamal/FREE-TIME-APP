import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "MENTION",
        "INTERACT-WITH-MESSAGE",
        "EMAIL-VERIFIED",
        "REFERRER",
        "BUY-FRAME",
        "QUIZ-APP",
        "ANNOUNCEMENT",
        "GUESS-CARD",
        "MUSIC",
      ],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    messageLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PublicMessage",
    },
    mentionedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    interactedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    typeOfInteraction: {
      type: String,
      enum: ["loves", "likes", "dislikes"],
    },
    isCollected: {
      type: Boolean,
    },
    prize: {
      type: Number,
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
    },
    frame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Frame",
    },
    announceContent: {
      type: String,
    },
    musicTitle: {
      type: String,
    },
    musicId: {
      type: String,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
