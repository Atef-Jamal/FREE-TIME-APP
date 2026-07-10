import { Document, model, Schema, Types } from "mongoose";

export interface IPrivateMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const privateMessageSchema = new Schema<IPrivateMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

privateMessageSchema.index({ conversation: 1 });
privateMessageSchema.index({ sender: 1, receiver: 1 });

const PrivateMessage = model<IPrivateMessage>("PrivateMessage", privateMessageSchema);

export default PrivateMessage;
