import "@tanstack/react-query";
import { AxiosError } from "axios";
import { IUser } from "./user";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<{ error: string }>;
  }
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
  offers: ISearchItem[];
  frames: ISearchItem[];
  musics: ISearchItem[];
}

export interface ITestimonial {
  _id: string;
  user: IUser;
  content: string;
  stars: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMusicDetail {
  id: number;
  title: string;
  artist: { name: string };
  album: { cover: string };
  preview: string;
}
