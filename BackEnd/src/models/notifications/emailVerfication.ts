import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IEmailVerifiedNotify extends Document {
  type: "EMAIL-VERIFIED";
  belongsTo: Types.ObjectId;
  prize: number;
  isCollected: boolean;
  isRead: boolean;
  createdAt: Date;
}

const emailVerficationSchema = new mongoose.Schema<IEmailVerifiedNotify>(
  {
    type: { type: String, default: "EMAIL-VERIFIED", enum: ["EMAIL-VERIFIED"] },
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

const EmailVerfication: Model<IEmailVerifiedNotify> = mongoose.model<IEmailVerifiedNotify>(
  "EmailVerfication",
  emailVerficationSchema,
);

export default EmailVerfication;
