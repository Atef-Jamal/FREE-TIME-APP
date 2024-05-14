import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    points: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Task",
      default: [],
    },
    coupons: {
      type: [String],
      default: [],
    },
    dailyReward: {
      type: Object,
      default: {
        week: 1,
        days: [
          {
            day: 1,
            isCollected: false,
            reward: 50,
          },
        ],
      },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      code: { type: String, default: "" },
      date: { type: Date, default: "" },
    },
    myFrames: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Frame",
      default: [],
    },
    mySongs: { type: Array, default: [] },
    activeFrame: {
      type: Object,
      default: null,
    },
    usersVisitedMe: {
      type: [
        {
          name: { type: String, required: true },
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          profilPicture: { type: String, default: "uploads/avatar.jpeg" },
          createdAt: { type: Date, default: new Date() },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
