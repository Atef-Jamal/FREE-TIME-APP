import { IUser } from "../../../../features/user/types";

export interface IPublicChatMessage {
  _id: string;
  type: "MESSAGE";
  sender: IUser;
  message: string;
  likes: string[];
  dislikes: string[];
  loves: string[];
  mentionedUsers: Set<IUser>;
  isSended?: "PENDING" | "SUCCESS" | "FAILED";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPublicChatFreeTime {
  _id: string;
  type: "FREETIME";
  typeOfTask: "REFERRER" | "OFFER" | "MUSIC" | "FRAME" | "EMAIL-VERIFIED";
  sender: IUser;
  newUserReferred: IUser;
  musicTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IPublicChatItem = IPublicChatMessage | IPublicChatFreeTime;

export interface ICashedPublicChat {
  pageParams: number[];
  pages: { messages: IPublicChatItem[]; hasMore: boolean }[];
}
