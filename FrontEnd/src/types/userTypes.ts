import { IFrame } from "./frameTypes";
import { IDailyReward } from "./rewardsTypes";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  emailVerified: boolean;
  points: number;
  copouns: string[];
  myFrames: IFrame[];
  activeFrame?: IFrame;
  mySongs: string[];
  completedTasks: string[];
  dailyReward: IDailyReward[];
  week: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICashedLiveStatsUsers {
  pageParams: number[];
  pages: { users: IUser[]; hasMore: boolean }[];
}
export interface ICashedLeaderboardUsers {
  users: IUser[];
  allDataLength: number;
}

export interface IVisitor {
  _id: string;
  visitor: IUser;
  visited: string;
  updatedAt: Date;
  createdAt: Date;
}
