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
  quizes: TypeSingleQuiz[];
  prize: number;
  name: string;
  category: "quiz" | "game";
  image: string;
  createdAt: Date;
}

export interface TypeGame {
  _id: string;
  name: string;
  category: string;
  prize: number;
  description: string;
  createdAt: Date;
  image: string;
}
