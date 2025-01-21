import { IFrame } from "./frameTypes";
import { IUser } from "./userTypes";

export interface IMentionNotify {
  _id: string;
  type: "MENTION";
  createdAt: Date;
  isRead: boolean;
  messageLocation: string;
  mentionedUser: IUser;
}

export interface IInteractWithMessageNotify {
  _id: string;
  type: "INTERACT-WITH-MESSAGE";
  typeOfInteraction: "loves" | "likes" | "dislikes";
  createdAt: Date;
  isRead: boolean;
  messageLocation: string;
  interactedUser: IUser;
}
export interface IEmailVerifiedNotify {
  _id: string;
  type: "EMAIL-VERIFIED";
  createdAt: Date;
  isRead: boolean;
  isCollected: boolean;
  prize: number;
}
export interface IReferrerNotify {
  _id: string;
  type: "REFERRER";
  createdAt: Date;
  isRead: boolean;
  isCollected: boolean;
  referredUser: IUser;
  prize: number;
}
export interface IBuyFrameNotify {
  _id: string;
  type: "BUY-FRAME";
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  frame: IFrame;
}
export interface IQuizTaskNotify {
  _id: string;
  type: "QUIZ-APP";
  createdAt: Date;
  isRead: boolean;
  isCollected: boolean;
  prize: number;
}
export interface IAnnouncementNoify {
  _id: string;
  type: "ANNOUNCEMENT";
  announceContent: string;
  createdAt: Date;
  isRead: boolean;
}
export interface IGuessCardTaskNotify {
  _id: string;
  type: "GUESS-CARD";
  isCollected: boolean;
  prize: number;
  createdAt: Date;
  isRead: boolean;
}
export interface IMusicNotify {
  _id: string;
  type: "MUSIC";
  musicId: string;
  musicTitle: string;
  price: number;
  createdAt: Date;
  isRead: boolean;
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
