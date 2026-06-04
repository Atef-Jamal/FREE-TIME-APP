import { Document, model, Schema, Types } from "mongoose";
import { IFrame } from "./frameModel.js";
import { IOffer } from "./offerModel.js";

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
  completedTasks: (Types.ObjectId | IOffer)[];
  mySongs: string[];
  myFrames: (Types.ObjectId | IFrame)[];
  activeFrame?: Types.ObjectId | IFrame;
  coupons: string[];
  week: number;
  dailyReward: IDailyReward[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
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
      code: String,
      date: Date,
    },
    activeFrame: { type: Schema.Types.ObjectId, ref: "FrameModel" },
    myFrames: [
      {
        type: Schema.Types.ObjectId,
        ref: "FrameModel",
      },
    ],
    completedTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "OfferModel",
      },
    ],
  },
  { timestamps: true },
);

userSchema.index({ isOnline: -1, points: -1, emailVerified: 1, createdAt: -1 });

const UserModel = model<IUser>("UserModel", userSchema);
export default UserModel;
