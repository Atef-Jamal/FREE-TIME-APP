import { TypeFrame } from "./frameTypes";
// import { TypeDailyReward } from "./rewardsTypes";

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  createdAt: Date;
  emailVerified: boolean;
  points: number;
  copouns: string[];
  activeFrame: TypeFrame | null;
  myFrames: TypeFrame[];
  mySongs: string[];
  completedTasks: string[];
  week: number;
  dailyReward: {
    day: number;
    availableAt: string;
    reward: number;
    isCollected: boolean;
  }[];
  usersVisitedMe: {
    _id: string;
    createdAt: Date;
    profilPicture: string;
    name: string;
  }[];
}

export interface TypeCashedUsers {
  pageParams: number[];
  pages: { users: User[]; userHighestPoints: string; hasMore: boolean }[];
}
