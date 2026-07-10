import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./user.js";

export interface IConversation extends Document {
  conversationName: string;
  participants: (Types.ObjectId | IUser)[];
  lastMessage?: Types.ObjectId;
  unreadCounts: Map<string, number>;
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
        ref: "User",
        required: true,
      },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "PrivateMessage" },
    unreadCounts: {
      type: Map,
      of: Number,
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({ participants: 1 });

const Conversation = model<IConversation>("Conversation", conversationSchema);
export default Conversation;
