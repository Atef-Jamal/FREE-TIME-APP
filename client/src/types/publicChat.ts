import { User } from "./user";

export interface TypePublicChatMessage {
  _id: string;
  type: "MESSAGE";
  createdAt: Date;
  updatedAt: Date;
  sender: User;
  message: string;
  isDeleted: boolean;
  likes: string[];
  dislikes: string[];
  loves: string[];
  mentioned: User | null;
}

export interface TypePublicChatFreeTime {
  _id: string;
  type: "FREETIME";
  typeOfTask: "REFERRER" | "TASK" | "MUSIC" | "FRAME" | "EMAIL-VERIFIED";
  sender: User;
  newUserReferred: User;
  musicTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TypePublicChatItem = TypePublicChatMessage | TypePublicChatFreeTime;
