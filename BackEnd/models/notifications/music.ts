import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    type: { type: String, default: "MUSIC", enum: ["MUSIC"] },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    musicTitle: {
      type: String,
      required: true,
    },
    musicId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Music = mongoose.model("Music", musicSchema);

export default Music;
