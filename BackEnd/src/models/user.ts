import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { generateNewWeekRewards } from "../utils";

export interface IDailyReward {
  day: number;
  availableAt: Date;
  reward: number;
  isCollected: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  googleId?: string;
  githubId?: string;
  password?: string;
  points: number;
  profilePicture: string;
  emailVerified: boolean;
  isOnline: boolean;
  emailVerificationCode: { code: string; date: Date };
  completedTasks: Types.ObjectId[];
  mySongs: string[];
  myFrames: Types.ObjectId[];
  activeFrame: Types.ObjectId | null;
  coupons: string[];
  week: number;
  dailyReward: IDailyReward[];
  createdAt: Date;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [18, "Name cannot be longer than 18 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is Required"],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid Email address"],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "https://res.cloudinary.com/dql5bc50n/image/upload/v1780306060/avatar_uogqav.jpg",
    },
    points: {
      type: Number,
      default: 0,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    week: { type: Number, default: 1 },
    dailyReward: [],
    mySongs: [],
    coupons: [String],
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      code: { type: String, default: "" },
      date: { type: Date, default: "" },
    },
    activeFrame: { type: Schema.Types.ObjectId, default: null },
    myFrames: [
      {
        type: Schema.Types.ObjectId,
        ref: "Frame",
      },
    ],
    completedTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true },
);

userSchema.index({ isOnline: -1, points: -1, emailVerified: 1, createdAt: -1 });

userSchema.pre("save", function (next) {
  if (this.isNew) {
    const newWeek = generateNewWeekRewards();
    this.dailyReward = newWeek;
  }
  next();
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
