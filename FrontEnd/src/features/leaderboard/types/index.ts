import { IUser } from "../../../features/user/types";

export interface ICashedLeaderboardUsers {
  users: IUser[];
  allDataLength: number;
}
