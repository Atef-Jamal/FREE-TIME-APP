import mongoose from "mongoose";

const emailVerficationSchema = new mongoose.Schema(
  {
    type: { type: String, default: "EMAIL-VERIFIED", enum: ["EMAIL-VERIFIED"] },
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
  },
  { timestamps: true },
);

const EmailVerfication = mongoose.model("EmailVerfication", emailVerficationSchema);

export default EmailVerfication;
