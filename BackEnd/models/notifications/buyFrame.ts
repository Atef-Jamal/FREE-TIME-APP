import mongoose from "mongoose";

const buyFrameSchema = new mongoose.Schema(
  {
    type: { type: String, default: "BUY-FRAME", enum: ["BUY-FRAME"] },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    frame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Frame",
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const BuyFrame = mongoose.model("BuyFrame", buyFrameSchema);

export default BuyFrame;
