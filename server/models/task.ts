import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    name: {
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
    quizes: {
      type: [
        {
          question: { type: String },
          choises: { type: [String] },
          correctAnswer: { type: String },
        },
      ],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
