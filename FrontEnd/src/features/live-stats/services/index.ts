import { axiosRequest } from "../../../lib/axios";
import { IUser } from "../../../features/user/types";

export const fetchLiveStatsUsers = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{
  users: IUser[];
  hasMore: boolean;
}> => {
  const response = await axiosRequest.get(`/api/users/live-stats-users?pageParam=${pageParam}`);
  const data = response.data;
  return data;
};
