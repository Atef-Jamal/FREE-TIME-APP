import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IMentionNotify extends Document {
  type: "MENTION";
  belongsTo: Types.ObjectId;
  createdAt: Date;
  isRead: boolean;
  messageLocation: Types.ObjectId;
  mentionedUser: Types.ObjectId;
}

const mentionSchema = new mongoose.Schema<IMentionNotify>(
  {
    type: { type: String, default: "MENTION", enum: ["MENTION"] },
    belongsTo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    messageLocation: {
      type: Schema.Types.ObjectId,
      ref: "PublicMessage",
      required: true,
    },
    mentionedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Mention: Model<IMentionNotify> = mongoose.model<IMentionNotify>("Mention", mentionSchema);

export default Mention;
