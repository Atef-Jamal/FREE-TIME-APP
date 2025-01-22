import mongoose from "mongoose";

const mentionSchema = new mongoose.Schema(
  {
    type: { type: String, default: "MENTION", enum: ["MENTION"] },
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
    mentionedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Mention = mongoose.model("Mention", mentionSchema);

export default Mention;
