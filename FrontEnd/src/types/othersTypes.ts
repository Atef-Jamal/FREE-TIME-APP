import "@tanstack/react-query";
import { AxiosError } from "axios";
import { User } from "./userTypes";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<{ error: string }>;
  }
}

export interface TypeFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: string;
}

export interface TypeSearchItem {
  _id: string;
  title: string;
  link: string;
  description: string;
  image: string;
}

export interface TypeSearchResults {
  features: TypeSearchItem[];
  users: TypeSearchItem[];
  apps: TypeSearchItem[];
  frames: TypeSearchItem[];
  musics: TypeSearchItem[];
}

export interface TypeConversationSocketData {
  reciever: string;
  sender: string;
}

export interface TypeTestimonial {
  _id: string;
  user: User;
  content: string;
  stars: number;
  createdAt: Date;
}

export interface TypeMusicDetail {
  id: number;
  title: string;
  artist: { name: string };
  album: { cover: string };
  preview: string;
}
