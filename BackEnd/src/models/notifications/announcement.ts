import mongoose, { Document, Model, Schema, Types } from "mongoose";
export interface IAnnouncementNoify extends Document {
  type: "ANNOUNCEMENT";
  belongsTo: Types.ObjectId;
  announceContent: string;
  createdAt: Date;
  isRead: boolean;
}
const announcementSchema = new mongoose.Schema<IAnnouncementNoify>(
  {
    type: { type: String, default: "ANNOUNCEMENT", enum: ["ANNOUNCEMENT"] },
    belongsTo: {
      type: Schema.Types.ObjectId,
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

const Announcement: Model<IAnnouncementNoify> = mongoose.model<IAnnouncementNoify>(
  "Announcement",
  announcementSchema,
);

export default Announcement;
