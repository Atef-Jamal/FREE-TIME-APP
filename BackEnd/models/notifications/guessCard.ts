import mongoose from "mongoose";

const guessCardSchema = new mongoose.Schema(
  {
    type: { type: String, default: "GUESS-CARD", enum: ["GUESS-CARD"] },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isCollected: {
      type: Boolean,
      required: true,
    },
    prize: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const GuessCard = mongoose.model("GuessCard", guessCardSchema);

export default GuessCard;
