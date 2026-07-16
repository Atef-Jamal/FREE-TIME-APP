import { skipToken, useQuery } from "@tanstack/react-query";
import {
  fetchGuestsCount,
  fetchOnlineUsers,
  fetchOnlineUsersData,
  fetchTopUser,
  fetchUserById,
} from "../services";

export const useFetchUser = ({ userId }: { userId: string | undefined }) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: userId ? () => fetchUserById({ userId }) : skipToken,
  });
};

export const useFetchOnlineUsers = () => {
  return useQuery({
    queryKey: ["onlines-users"],
    queryFn: fetchOnlineUsers,
  });
};
export const useFetchOnlineUsersData = () => {
  return useQuery({
    queryKey: ["online-users-data"],
    queryFn: fetchOnlineUsersData,
  });
};

export const useFetchActiveGuestsCount = () => {
  return useQuery<number>({
    queryKey: ["total-guests"],
    queryFn: fetchGuestsCount,
  });
};

export const useFetchTopUser = () => {
  return useQuery({
    queryKey: ["top-user"],
    queryFn: fetchTopUser,
  });
};
