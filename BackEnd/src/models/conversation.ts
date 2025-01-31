import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IConversation extends Document {
  conversationName: string;
  participants: Types.ObjectId[];
  lastMessage: Types.ObjectId | null;
}

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
    lastMessage: { type: Schema.Types.ObjectId, ref: "PrivateMessage", default: null },
  },
  {
    timestamps: true,
  },
);

const Conversation: Model<IConversation> = mongoose.model<IConversation>("Conversation", conversationSchema);
export default Conversation;
