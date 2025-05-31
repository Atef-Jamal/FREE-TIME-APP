import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IMusicNotify extends Document {
  type: "MUSIC";
  belongsTo: Types.ObjectId;
  musicId: string;
  musicTitle: string;
  price: number;
  isRead: boolean;
  createdAt: Date;
}

const musicSchema = new mongoose.Schema<IMusicNotify>(
  {
    type: { type: String, default: "MUSIC", enum: ["MUSIC"] },
    belongsTo: {
      type: Schema.Types.ObjectId,
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
      min: 0,
      required: true,
    },
  },
  { timestamps: true },
);
musicSchema.index({ belongsTo: 1 });

const Music: Model<IMusicNotify> = mongoose.model<IMusicNotify>("Music", musicSchema);

export default Music;
