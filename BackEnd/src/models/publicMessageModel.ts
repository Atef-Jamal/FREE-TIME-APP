import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./userModel.js";

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
  typeOfTask?: "REFERRER" | "TASK" | "MUSIC" | "FRAME" | "EMAIL-VERIFIED";
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
      ref: "UserModel",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    newUserReferred: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
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
        ref: "UserModel",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
      },
    ],
    loves: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
      },
    ],
    mentionedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const PublicMessageModel = model<IPublicChatItem>("PublicMessageModel", publicMessageSchema);
export default PublicMessageModel;
