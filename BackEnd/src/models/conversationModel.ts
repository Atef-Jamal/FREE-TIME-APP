import { Document, model, Schema, Types } from "mongoose";
import { IPrivateMessage } from "./privateMessageModel.js";
import { IUser } from "./userModel.js";

export interface IConversation extends Document {
  conversationName: string;
  participants: (Types.ObjectId | IUser)[];
  lastMessage?: IPrivateMessage;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    conversationName: {
      type: String,
      default: "",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
      },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "PrivateMessageModel" },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({ participants: 1 });

const ConversationModel = model<IConversation>("ConversationModel", conversationSchema);
export default ConversationModel;
