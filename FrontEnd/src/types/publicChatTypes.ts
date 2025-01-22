import { IUser } from "./userTypes";

export interface IPublicChatMessage {
  _id: string;
  type: "MESSAGE";
  createdAt: Date;
  updatedAt: Date;
  sender: IUser;
  message: string;
  isDeleted: boolean;
  likes: string[];
  dislikes: string[];
  loves: string[];
  mentionedUsers: Set<IUser>;
  isSended?: "PENDING" | "SUCCESS" | "FAILED";
}

export interface IPublicChatFreeTime {
  _id: string;
  type: "FREETIME";
  typeOfTask: "REFERRER" | "TASK" | "MUSIC" | "FRAME" | "EMAIL-VERIFIED";
  sender: IUser;
  newUserReferred: IUser;
  musicTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IPublicChatItem = IPublicChatMessage | IPublicChatFreeTime;

export interface ICashedPublicChat {
  pageParams: number[];
  pages: { messages: IPublicChatItem[]; hasOlder: boolean }[];
}
