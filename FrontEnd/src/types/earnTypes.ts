import { User } from "./userTypes";

interface TypeQuiz {
  question: string;
  choises: string[];
  correctAnswer: string;
}

export interface TypeGameApp {
  _id: string;
  type: "GAME_APP";
  isAvailable: "AVAILABLE" | "UNAVAILABLE";
  devices: "DESKTOP" | "ANDROID" | "MAC" | "ALL";
  title: string;
  image: string;
  prize: number;
  rating: number;
  completedBy: User[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface TypeQuizApp {
  _id: string;
  type: "QUIZ_APP";
  isAvailable: "AVAILABLE" | "UNAVAILABLE";
  devices: "DESKTOP" | "ANDROID" | "MAC" | "ALL";
  quizes: TypeQuiz[];
  title: string;
  image: string;
  prize: number;
  rating: number;
  completedBy: User[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TypeTaskApp = TypeQuizApp | TypeGameApp;

export type TypeFilterQuery =
  | "DESKTOP"
  | "ANDROID"
  | "MAC"
  | "ALL"
  | "REWARD"
  | "POPULAR"
  | "RAITING";
