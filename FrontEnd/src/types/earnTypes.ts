import { IUser } from "./userTypes";

interface IQuiz {
  question: string;
  choises: string[];
  correctAnswer: string;
}

export interface IGameTask {
  _id: string;
  type: "GAME_APP";
  isAvailable: "AVAILABLE" | "UNAVAILABLE";
  devices: "DESKTOP" | "ANDROID" | "MAC" | "ALL";
  title: string;
  image: string;
  reviews: IReview[];
  prize: number;
  rating: number;
  completedBy: IUser[];
  description: string;
  createdAt: Date;
}

export interface IQuizTask {
  _id: string;
  type: "QUIZ_APP";
  isAvailable: "AVAILABLE" | "UNAVAILABLE";
  devices: "DESKTOP" | "ANDROID" | "MAC" | "ALL";
  quizes: IQuiz[];
  reviews: IReview[];
  title: string;
  image: string;
  prize: number;
  rating: number;
  completedBy: IUser[];
  description: string;
  createdAt: Date;
}

export type ITask = IQuizTask | IGameTask;

export interface IReview {
  _id: string;
  appId: string;
  user: IUser;
  comment: string;
}

export type IFilterByPopularity = "ALL" | "POPULAR" | "REWARD" | "RAITING";

export type IFilterByDevice = "ALL" | "DESKTOP" | "ANDROID" | "MAC";
