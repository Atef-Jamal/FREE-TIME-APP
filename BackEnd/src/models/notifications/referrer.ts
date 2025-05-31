import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IReferrerNotify extends Document {
  type: "REFERRER";
  belongsTo: Types.ObjectId;
  referredUser: Types.ObjectId;
  prize: number;
  isCollected: boolean;
  isRead: boolean;
  createdAt: Date;
}

const referrerSchema = new mongoose.Schema<IReferrerNotify>(
  {
    type: { type: String, default: "REFERRER", enum: ["REFERRER"] },
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
      required: true,
    },
    referredUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

referrerSchema.index({ belongsTo: 1 });

const Referrer: Model<IReferrerNotify> = mongoose.model<IReferrerNotify>("Referrer", referrerSchema);

export default Referrer;
