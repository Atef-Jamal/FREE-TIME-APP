import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./user.js";

export interface IPublicChatMessage extends Document {
  type: "MESSAGE";
  sender: Types.ObjectId | IUser;
  likes: (Types.ObjectId | IUser)[];
  dislikes: (Types.ObjectId | IUser)[];
  loves: (Types.ObjectId | IUser)[];
  message: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPublicChatFreeTime extends Document {
  type: "FREETIME";
  sender: Types.ObjectId | IUser;
  likes: (Types.ObjectId | IUser)[];
  dislikes: (Types.ObjectId | IUser)[];
  loves: (Types.ObjectId | IUser)[];
  message: string;
  isDeleted: boolean;
  typeOfTask?: "REFERRER" | "OFFER" | "MUSIC" | "FRAME" | "EMAIL-VERIFIED";
  newUserReferred?: Types.ObjectId | IUser;
  mentionedUsers?: (Types.ObjectId | IUser)[];
  musicTitle?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IPublicChatItem = IPublicChatMessage | IPublicChatFreeTime;

const publicMessageSchema = new Schema<IPublicChatItem>(
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
      enum: ["REFERRER", "OFFER", "MUSIC", "FRAME", "EMAIL-VERIFIED"],
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

const PublicMessage = model<IPublicChatItem>("PublicMessage", publicMessageSchema);
export default PublicMessage;
