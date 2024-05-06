import { TypeFrame } from "./frame";
import { User } from "./user";

export interface TypeMentionNotify {
  _id: string;
  type: "MENTION";
  createdAt: Date;
  isRead: boolean;
  messageLocation: string;
  mentionedUser: User;
}
export interface TypeEmailVerifiedNotify {
  _id: string;
  type: "EMAIL-VERIFIED";
  createdAt: Date;
  isRead: boolean;
  isCollected: boolean;
  prize: number;
}
export interface TypeReferrerNotify {
  _id: string;
  type: "REFERRER";
  createdAt: Date;
  isRead: boolean;
  isCollected: boolean;
  referredUser: User;
  prize: number;
}
export interface TypeBuyFrameNotify {
  _id: string;
  type: "BUY-FRAME";
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  frame: TypeFrame;
}
export interface TypeQuizAppNotify {
  _id: string;
  type: "QUIZ-APP";
  createdAt: Date;
  isRead: boolean;
  isCollected: boolean;
  prize: number;
}
export interface TypeAnnouncementNoify {
  _id: string;
  type: "ANNOUNCEMENT";
  announceContent: string;
  createdAt: Date;
  isRead: boolean;
}
export interface TypeGuessCardNotify {
  _id: string;
  type: "GUESS-CARD";
  isCollected: boolean;
  prize: number;
  createdAt: Date;
  isRead: boolean;
}
export interface TypeMusicNotify {
  _id: string;
  type: "MUSIC";
  musicId: string;
  musicTitle: string;
  price: number;
  createdAt: Date;
  isRead: boolean;
}

export type TypeNotifications =
  | TypeMentionNotify
  | TypeEmailVerifiedNotify
  | TypeReferrerNotify
  | TypeBuyFrameNotify
  | TypeQuizAppNotify
  | TypeAnnouncementNoify
  | TypeGuessCardNotify
  | TypeMusicNotify;
