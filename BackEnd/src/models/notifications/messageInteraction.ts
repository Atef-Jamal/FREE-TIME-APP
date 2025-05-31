import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IInteractWithMessageNotify extends Document {
  type: "INTERACT-WITH-MESSAGE";
  typeOfInteraction: "loves" | "likes" | "dislikes";
  belongsTo: Types.ObjectId;
  interactedUser: Types.ObjectId;
  messageLocation: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const messageInteractionSchema = new mongoose.Schema<IInteractWithMessageNotify>(
  {
    type: { type: String, default: "INTERACT-WITH-MESSAGE", enum: ["INTERACT-WITH-MESSAGE"] },
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
    typeOfInteraction: {
      type: String,
      enum: ["loves", "likes", "dislikes"],
      required: true,
    },
    interactedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

messageInteractionSchema.index({ belongsTo: 1 });

const MessageInteraction: Model<IInteractWithMessageNotify> = mongoose.model<IInteractWithMessageNotify>(
  "MessageInteraction",
  messageInteractionSchema,
);

export default MessageInteraction;
