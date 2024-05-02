import { User } from "./user";

export interface TypePrivateMessage {
  sender: User;
  message: string;
  _id: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
