import { Document, model, Schema, Types } from "mongoose";
import { IOfferReview } from "./offerReviewModel.js";
import { IUser } from "./userModel.js";

interface IQuiz {
  question: string;
  choises: string[];
  correctAnswer: string;
}

export interface IOffer extends Document {
  type: "QUIZ_APP" | "GAME_APP";
  isAvailable: "AVAILABLE" | "UNAVAILABLE";
  devices: "DESKTOP" | "ANDROID" | "MAC" | "ALL";
  quizes: IQuiz[];
  title: string;
  image: string;
  prize: number;
  rating: number;
  reviews: (Types.ObjectId | IOfferReview)[];
  completedBy: (Types.ObjectId | IUser)[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>(
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
        ref: "UserModel",
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "OfferReviewModel",
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

offerSchema.index({ prize: -1 });
offerSchema.index({ rating: -1 });

const OfferModel = model<IOffer>("OfferModel", offerSchema);
export default OfferModel;
