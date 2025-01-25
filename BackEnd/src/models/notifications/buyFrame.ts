import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IBuyFrameNotify extends Document {
  type: "BUY-FRAME";
  belongsTo: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  frame: Types.ObjectId;
  price: number;
}

const buyFrameSchema = new mongoose.Schema<IBuyFrameNotify>(
  {
    type: { type: String, default: "BUY-FRAME", enum: ["BUY-FRAME"] },
    belongsTo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    frame: {
      type: Schema.Types.ObjectId,
      ref: "Frame",
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { timestamps: true },
);

const BuyFrame: Model<IBuyFrameNotify> = mongoose.model<IBuyFrameNotify>("BuyFrame", buyFrameSchema);

export default BuyFrame;
