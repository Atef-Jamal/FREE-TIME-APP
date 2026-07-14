import { IFrame } from "../../marketplace/types";
import { IDailyReward } from "../../rewards/types";

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
  completedOffers: string[];
  dailyReward: IDailyReward[];
  week: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfileView {
  _id: string;
  viewer: IUser;
  profileOwner: IUser;
  viewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
