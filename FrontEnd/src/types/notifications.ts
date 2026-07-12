import { IFrame } from "./frames";
import { IUser } from "./user";

interface INotificationBase {
  _id: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMentionNotify extends INotificationBase {
  type: "MENTION";
  metadata: { messageLocation: string; mentionedUser: IUser };
}

export interface IInteractWithMessageNotify extends INotificationBase {
  type: "INTERACT-WITH-MESSAGE";
  metadata: {
    typeOfInteraction: "loves" | "likes" | "dislikes";
    messageLocation: string;
    interactedUser: IUser;
  };
}
export interface IEmailVerifiedNotify extends INotificationBase {
  type: "EMAIL-VERIFIED";
  metadata: {
    isCollected: boolean;
    prize: number;
  };
}
export interface IReferrerNotify extends INotificationBase {
  type: "REFERRER";
  metadata: {
    isCollected: boolean;
    referredUser: IUser;
    prize: number;
  };
}
export interface IBuyFrameNotify extends INotificationBase {
  type: "BUY-FRAME";
  metadata: { frame: IFrame; price: number };
}
export interface IQuizTaskNotify extends INotificationBase {
  type: "QUIZ-APP";
  metadata: { isCollected: boolean; prize: number };
}
export interface IAnnouncementNoify extends INotificationBase {
  type: "ANNOUNCEMENT";
  metadata: { announceContent: string };
}
export interface IGuessCardTaskNotify extends INotificationBase {
  type: "GUESS-CARD";
  metadata: { isCollected: boolean; prize: number };
}

export interface IMusicNotify extends INotificationBase {
  type: "MUSIC";
  metadata: { musicId: string; musicTitle: string; price: number };
}

export type INotifications =
  | IMentionNotify
  | IEmailVerifiedNotify
  | IReferrerNotify
  | IBuyFrameNotify
  | IQuizTaskNotify
  | IAnnouncementNoify
  | IGuessCardTaskNotify
  | IMusicNotify
  | IInteractWithMessageNotify;

export type ICashedNotificaions = INotifications[];
