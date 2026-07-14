import { IUser } from "../../user/types";

export interface ICashedLiveStatsUsers {
  pageParams: number[];
  pages: { users: IUser[]; hasMore: boolean }[];
}
