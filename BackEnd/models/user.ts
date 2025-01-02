import mongoose from "mongoose";
import { generateNewWeekRewards } from "../utils";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [18, "Name cannot be longer than 18 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is Required"],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid Email address"],
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
      default: [],
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
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  if (this.isNew) {
    const newWeek = generateNewWeekRewards();
    this.dailyReward = newWeek;
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
