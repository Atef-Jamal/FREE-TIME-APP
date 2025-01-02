import mongoose from "mongoose";

const PublicMessageSchema = new mongoose.Schema(
  {
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
    type: {
      type: String,
      enum: ["MESSAGE", "FREETIME"],
      required: true,
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
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    dislikes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    loves: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    mentioned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const PublicMessage = mongoose.model("PublicMessage", PublicMessageSchema);
export default PublicMessage;
