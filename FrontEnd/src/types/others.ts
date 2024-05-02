import { User } from "./user";

export interface TypeDailyReward {
  day: number;
  isCollected: boolean;
  reward: number;
}

export interface TypeSingleQuiz {
  question: string;
  choises: string[];
  correctAnswer: string;
}

export interface TypeTaskApp {
  _id: string;
  type: "QUIZ_APP" | "GAME_APP";
  isAvailable: "AVAILABLE" | "UNAVAILABLE";
  quizes: TypeSingleQuiz[];
  title: string;
  image: string;
  prize: number;
  rating: number;
  completedBy: User[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
