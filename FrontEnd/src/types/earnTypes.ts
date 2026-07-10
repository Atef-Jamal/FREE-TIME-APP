import { IUser } from "./userTypes";

interface IQuiz {
  question: string;
  choises: string[];
  correctAnswer: string;
}

export interface IGameOffer {
  _id: string;
  type: "GAME_APP";
  isAvailable: "AVAILABLE" | "UNAVAILABLE";
  devices: "DESKTOP" | "ANDROID" | "MAC" | "ALL";
  title: string;
  image: string;
  reviews: IOfferReview[];
  prize: number;
  rating: number;
  completedBy: IUser[];
  description: string;
  createdAt: Date;
}

export interface IQuizOffer {
  _id: string;
  type: "QUIZ_APP";
  isAvailable: "AVAILABLE" | "UNAVAILABLE";
  devices: "DESKTOP" | "ANDROID" | "MAC" | "ALL";
  quizes: IQuiz[];
  reviews: IOfferReview[];
  title: string;
  image: string;
  prize: number;
  rating: number;
  completedBy: IUser[];
  description: string;
  createdAt: Date;
}

export type IOffer = IQuizOffer | IGameOffer;

export interface IOfferReview {
  _id: string;
  offerId: string;
  user: IUser;
  comment: string;
}

export type IFilterByPopularity = "ALL" | "POPULAR" | "REWARD" | "RAITING";

export type IFilterByDevice = "ALL" | "DESKTOP" | "ANDROID" | "MAC";
