import mongoose from "mongoose";

const quizeAppSchema = new mongoose.Schema(
  {
    type: { type: String, default: "QUIZ-APP", enum: ["QUIZ-APP"] },
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

const QuizeApp = mongoose.model("QuizeApp", quizeAppSchema);

export default QuizeApp;
