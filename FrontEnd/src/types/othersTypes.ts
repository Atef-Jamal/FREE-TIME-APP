import "@tanstack/react-query";
import { AxiosError } from "axios";
import { IUser } from "./userTypes";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<{ error: string }>;
  }
}

export interface IFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: File | null;
}

export interface ISearchItem {
  _id: string;
  title: string;
  link: string;
  description: string;
  image: string;
}

export interface ISearchResults {
  features: ISearchItem[];
  users: ISearchItem[];
  apps: ISearchItem[];
  frames: ISearchItem[];
  musics: ISearchItem[];
}

export interface IConversationReadedSocketData {
  receiver: string;
  sender: string;
}

export interface ITestimonial {
  _id: string;
  user: IUser;
  content: string;
  stars: number;
  createdAt: Date;
}

export interface IMusicDetail {
  id: number;
  title: string;
  artist: { name: string };
  album: { cover: string };
  preview: string;
}
