import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPrivateMessage extends Document {
  conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
const privateMessageSchema = new mongoose.Schema<IPrivateMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);
privateMessageSchema.index({ sender: 1, receiver: 1 });
const PrivateMessage: Model<IPrivateMessage> = mongoose.model<IPrivateMessage>(
  "PrivateMessage",
  privateMessageSchema,
);

export default PrivateMessage;
