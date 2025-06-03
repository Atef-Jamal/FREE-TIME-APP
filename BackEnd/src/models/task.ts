import mongoose, { Document, Model, Schema, Types } from "mongoose";

interface IQuiz {
  question: string;
  choises: string[];
  correctAnswer: string;
}

export interface ITask extends Document {
  type: "QUIZ_APP" | "GAME_APP";
  isAvailable: "AVAILABLE" | "UNAVAILABLE";
  devices: "DESKTOP" | "ANDROID" | "MAC" | "ALL";
  quizes: IQuiz[];
  reviews: Types.ObjectId[];
  title: string;
  image: string;
  prize: number;
  rating: number;
  completedBy: Types.ObjectId[];
  description: string;
  createdAt: Date;
}

const taskSchema: Schema<ITask> = new mongoose.Schema<ITask>(
  {
    type: {
      type: String,
      enum: ["QUIZ_APP", "GAME_APP"],
      required: true,
    },
    isAvailable: {
      type: String,
      enum: ["AVAILABLE", "UNAVAILABLE"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    prize: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    devices: {
      type: String,
      enum: ["DESKTOP", "ANDROID", "MAC", "ALL"],
      default: "ALL",
    },
    completedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      type: Number,
      default: 5,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "AppsReview",
      },
    ],
    quizes: [
      {
        question: { type: String },
        choises: { type: [String] },
        correctAnswer: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ prize: -1 });
taskSchema.index({ rating: -1 });

const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);
export default Task;
