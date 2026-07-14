import { axiosRequest } from "../../../lib/axios";
import { ICashedLeaderboardUsers } from "../types";

export const getLeaderboardUsers = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<ICashedLeaderboardUsers> => {
  const response = await axiosRequest.get(`/api/users/users-leaderboard?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};
