import mongoose, { Document, Model, Types } from "mongoose";

export interface IQuizTaskNotify extends Document {
  belongsTo: Types.ObjectId;
  type: "QUIZ-APP";
  prize: number;
  isCollected: boolean;
  isRead: boolean;
  createdAt: Date;
}

const quizeAppSchema = new mongoose.Schema<IQuizTaskNotify>(
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
      default: false,
    },
    prize: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { timestamps: true },
);

const QuizeApp: Model<IQuizTaskNotify> = mongoose.model<IQuizTaskNotify>("QuizeApp", quizeAppSchema);

export default QuizeApp;
