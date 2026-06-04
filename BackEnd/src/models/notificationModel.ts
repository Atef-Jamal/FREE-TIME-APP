import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./userModel.js";
import { IFrame } from "./frameModel.js";
import { IPublicChatItem } from "./publicMessageModel.js";

export interface INotification extends Document {
  type:
    | "REFERRER"
    | "MUSIC"
    | "QUIZ-APP"
    | "INTERACT-WITH-MESSAGE"
    | "MENTION"
    | "BUY-FRAME"
    | "EMAIL-VERIFIED"
    | "GUESS-CARD"
    | "ANNOUNCEMENT";
  belongsTo: Types.ObjectId | IUser;
  isRead: boolean;
  metadata: {
    isCollected?: boolean;
    prize?: number;
    referredUser?: Types.ObjectId | IUser;
    musicId?: string;
    musicTitle?: string;
    price?: number;
    typeOfInteraction?: "loves" | "likes" | "dislikes";
    interactedUser?: Types.ObjectId | IUser;
    messageLocation?: Types.ObjectId | IPublicChatItem;
    mentionedUser?: Types.ObjectId | IUser;
    frame?: Types.ObjectId | IFrame;
    announceContent?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: [
        "REFERRER",
        "MUSIC",
        "QUIZ-APP",
        "INTERACT-WITH-MESSAGE",
        "MENTION",
        "BUY-FRAME",
        "EMAIL-VERIFIED",
        "GUESS-CARD",
        "ANNOUNCEMENT",
      ],
    },
    belongsTo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "UserModel",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      isCollected: {
        type: Boolean,
      },
      prize: {
        type: Number,
      },
      referredUser: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
      },
      price: {
        type: Number,
        min: 0,
      },
      musicId: {
        type: String,
      },
      musicTitle: {
        type: String,
      },
      interactedUser: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
      },
      messageLocation: {
        type: Schema.Types.ObjectId,
        ref: "PublicMessageModel",
      },
      typeOfInteraction: {
        type: String,
        enum: ["loves", "likes", "dislikes"],
      },
      mentionedUser: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
      },
      frame: {
        type: Schema.Types.ObjectId,
        ref: "FrameModel",
      },
      announceContent: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

notificationSchema.index({ belongsTo: 1 });

const NotificationModel = model<INotification>("NotificationModel", notificationSchema);

export default NotificationModel;
