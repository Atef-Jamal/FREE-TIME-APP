import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    type: { type: String, default: "ANNOUNCEMENT", enum: ["ANNOUNCEMENT"] },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    announceContent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
