import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPrivateMessage {
  sender: Types.ObjectId;
  message: string;
  isRead: boolean;
}

export interface IConversation extends Document {
  conversationName: string;
  participants: [Types.ObjectId, Types.ObjectId];
  lastMessage: IPrivateMessage | null;
  messages: IPrivateMessage[];
}

const messageSchema: Schema<IPrivateMessage> = new mongoose.Schema<IPrivateMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const conversationSchema: Schema<IConversation> = new mongoose.Schema<IConversation>(
  {
    conversationName: {
      type: String,
      default: "",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    lastMessage: { type: messageSchema, default: null },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  },
);

const Conversation: Model<IConversation> = mongoose.model<IConversation>("Conversation", conversationSchema);
export default Conversation;
