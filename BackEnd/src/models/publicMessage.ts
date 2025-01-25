import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPublicChatMessage extends Document {
  type: "MESSAGE";
  sender: Types.ObjectId;
  message: string;
  isDeleted: boolean;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  loves: Types.ObjectId[];
  mentionedUsers: Types.ObjectId[];
  typeOfTask: "REFERRER" | "TASK" | "MUSIC" | "FRAME" | "EMAIL-VERIFIED";
  newUserReferred: Types.ObjectId;
  musicTitle: string;
  createdAt: Date;
}

const PublicMessageSchema: Schema<IPublicChatMessage> = new mongoose.Schema<IPublicChatMessage>(
  {
    type: {
      type: String,
      enum: ["MESSAGE", "FREETIME"],
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    newUserReferred: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    musicTitle: {
      type: String,
    },
    typeOfTask: {
      type: String,
      enum: ["REFERRER", "TASK", "MUSIC", "FRAME", "EMAIL-VERIFIED"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    loves: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    mentionedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const PublicMessage: Model<IPublicChatMessage> = mongoose.model<IPublicChatMessage>(
  "PublicMessage",
  PublicMessageSchema,
);
export default PublicMessage;
