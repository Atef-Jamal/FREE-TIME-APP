import { IFrame } from "./frameTypes";
import { IDailyReward } from "./rewardsTypes";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  createdAt: Date;
  emailVerified: boolean;
  points: number;
  copouns: string[];
  activeFrame: IFrame | null;
  myFrames: IFrame[];
  mySongs: string[];
  completedTasks: string[];
  week: number;
  dailyReward: IDailyReward[];
  usersVisitedMe: IUser[];
}

export interface ICashedLiveStatsUsers {
  pageParams: number[];
  pages: { users: IUser[]; userHighestPoints: string; hasMore: boolean }[];
}

export interface IVisitor {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  visitor: IUser;
  visited: string;
}
