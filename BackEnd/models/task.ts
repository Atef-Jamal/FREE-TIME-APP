import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
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
    image: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    prize: {
      type: Number,
      required: true,
    },
    completedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    rating: {
      type: Number,
      default: 5,
    },
    quizes: {
      type: [
        {
          question: { type: String },
          choises: { type: [String] },
          correctAnswer: { type: String },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
