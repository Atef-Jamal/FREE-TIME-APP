import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./userModel.js";
import { IConversation } from "./conversationModel.js";

export interface IPrivateMessage extends Document {
  conversation: Types.ObjectId | IConversation;
  sender: Types.ObjectId | IUser;
  receiver: Types.ObjectId | IUser;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const privateMessageSchema = new Schema<IPrivateMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "ConversationModel", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

privateMessageSchema.index({ sender: 1, receiver: 1 });

const PrivateMessageModel = model<IPrivateMessage>("PrivateMessageModel", privateMessageSchema);

export default PrivateMessageModel;
