import { TypeFrame } from "./frameTypes";
import { TypeDailyReward } from "./rewardsTypes";

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  emailVerified: boolean;
  points: number;
  copouns: string[];
  activeFrame: TypeFrame | null;
  myFrames: TypeFrame[];
  mySongs: string[];
  completedTasks: string[];
  dailyReward: { week: number; days: TypeDailyReward[] };
  usersVisitedMe: {
    _id: string;
    createdAt: Date;
    profilPicture: string;
    name: string;
  }[];
}
