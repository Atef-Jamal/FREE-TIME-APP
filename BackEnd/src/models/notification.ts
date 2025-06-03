import mongoose, { Document, Model, Schema, Types } from "mongoose";

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
  belongsTo: Types.ObjectId;
  isRead: boolean;
  metadata: {
    isCollected?: boolean;
    prize?: number;
    referredUser?: Types.ObjectId;
    musicId?: string;
    musicTitle?: string;
    price?: number;
    typeOfInteraction?: "loves" | "likes" | "dislikes";
    interactedUser?: Types.ObjectId;
    messageLocation?: Types.ObjectId;
    mentionedUser?: Types.ObjectId;
    frame?: Types.ObjectId;
    announceContent?: string;
  };
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>(
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
      ref: "User",
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
        ref: "User",
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
        ref: "User",
      },
      messageLocation: {
        type: Schema.Types.ObjectId,
        ref: "PublicMessage",
      },
      typeOfInteraction: {
        type: String,
        enum: ["loves", "likes", "dislikes"],
      },
      mentionedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      frame: {
        type: Schema.Types.ObjectId,
        ref: "Frame",
      },
      announceContent: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

notificationSchema.index({ belongsTo: 1 });

const Notification: Model<INotification> = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
