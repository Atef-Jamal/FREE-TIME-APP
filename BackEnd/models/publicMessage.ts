import mongoose from "mongoose";

const PublicMessageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["MESSAGE", "FREETIME"],
      required: true,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    newUserReferred: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    musicTitle: {
      type: String,
    },
    typeOfTask: {
      type: String,
      enum: ["REFERRER", "TASK", "MUSIC", "FRAME", "EMAIL-VERIFIED"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    loves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    mentionedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const PublicMessage = mongoose.model("PublicMessage", PublicMessageSchema);
export default PublicMessage;
