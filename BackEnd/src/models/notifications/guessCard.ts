import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IGuessCardTaskNotify extends Document {
  type: "GUESS-CARD";
  belongsTo: Types.ObjectId;
  prize: number;
  isCollected: boolean;
  isRead: boolean;
  createdAt: Date;
}

const guessCardSchema = new mongoose.Schema<IGuessCardTaskNotify>(
  {
    type: { type: String, default: "GUESS-CARD", enum: ["GUESS-CARD"] },
    belongsTo: {
      type: Schema.Types.ObjectId,
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

const GuessCard: Model<IGuessCardTaskNotify> = mongoose.model<IGuessCardTaskNotify>(
  "GuessCard",
  guessCardSchema,
);

export default GuessCard;
