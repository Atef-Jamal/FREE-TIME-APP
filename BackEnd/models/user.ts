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
    week: { type: Number, default: 1 },
    dailyReward: {
      type: Array,
      default: [
        {
          day: 1,
          reward: 50,
          availableAt: new Date(new Date().setHours(0, 0, 0, 0)),
          isCollected: false,
        },
        {
          day: 2,
          reward: 100,
          availableAt: new Date(
            new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
              0,
              0,
              0,
              0
            )
          ),
          isCollected: false,
        },
        {
          day: 3,
          reward: 150,
          availableAt: new Date(
            new Date(new Date().setDate(new Date().getDate() + 2)).setHours(
              0,
              0,
              0,
              0
            )
          ),
          isCollected: false,
        },
        {
          day: 4,
          reward: 200,
          availableAt: new Date(
            new Date(new Date().setDate(new Date().getDate() + 3)).setHours(
              0,
              0,
              0,
              0
            )
          ),
          isCollected: false,
        },
        {
          day: 5,
          reward: 250,
          availableAt: new Date(
            new Date(new Date().setDate(new Date().getDate() + 4)).setHours(
              0,
              0,
              0,
              0
            )
          ),
          isCollected: false,
        },
        {
          day: 6,
          reward: 300,
          availableAt: new Date(
            new Date(new Date().setDate(new Date().getDate() + 5)).setHours(
              0,
              0,
              0,
              0
            )
          ),
          isCollected: false,
        },
        {
          day: 7,
          reward: 350,
          availableAt: new Date(
            new Date(new Date().setDate(new Date().getDate() + 6)).setHours(
              0,
              0,
              0,
              0
            )
          ),
          isCollected: false,
        },
      ],
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
