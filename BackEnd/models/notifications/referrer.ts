import mongoose from "mongoose";

const referrerSchema = new mongoose.Schema(
  {
    type: { type: String, default: "REFERRER", enum: ["REFERRER"] },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isCollected: {
      type: Boolean,
      required: true,
    },
    prize: {
      type: Number,
      required: true,
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Referrer = mongoose.model("Referrer", referrerSchema);

export default Referrer;
