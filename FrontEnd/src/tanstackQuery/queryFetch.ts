import { keepPreviousData, skipToken, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchAllConversations,
  fetchAllFrames,
  fetchAllTasks,
  fetchAppDetails,
  fetchMusics,
  fetchMyNotifications,
  fetchPrivateChatMessages,
  fetchPublicChatMessages,
  fetchTestimonials,
  fetchUserById,
  getLeaderboardUsers,
  getOnlineUsers,
  getSearchResults,
  getUsers,
} from "../services";

import type { IFilterByDevice, IFilterByPopularity } from "../types";
import { fetchUserActivities } from "../services/usersService";

export const useInfiniteLiveStatsUsers = () => {
  return useInfiniteQuery({
    queryKey: ["live-stats-users"],
    queryFn: ({ pageParam }) => getUsers({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastpage, _, pageParam) => {
      return lastpage.hasMore ? pageParam + 1 : undefined;
    },
    staleTime: 60 * 60 * 1000,
  });
};

export const useInfinitePublicChatMsges = () => {
  return useInfiniteQuery({
    queryKey: ["public-chat-messages"],
    queryFn: ({ pageParam }) => fetchPublicChatMessages({ pageParam, limit: 15 }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage, _, pageParam) => {
      return firstPage.hasOlder ? pageParam + 1 : undefined;
    },
    getNextPageParam: () => undefined,
    staleTime: 60 * 60 * 1000,
  });
};

export const useInfiniteConversations = ({ userAuth }: { userAuth: boolean }) => {
  return useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: userAuth ? ({ pageParam }) => fetchAllConversations({ pageParam }) : skipToken,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, pageParam) => (lastPage.hasMore ? pageParam + 1 : undefined),
    staleTime: 60 * 60 * 1000,
  });
};

export const useInfiniteConversationMsgs = ({
  userAuth,
  activeChatId,
}: {
  userAuth: boolean;
  activeChatId: string | null;
}) => {
  return useInfiniteQuery({
    queryKey: ["conversation-messages", activeChatId],
    queryFn:
      userAuth && activeChatId
        ? ({ pageParam }) => fetchPrivateChatMessages({ pageParam, activeChatId })
        : skipToken,
    initialPageParam: 1,
    getPreviousPageParam: (firstPage, _, pageParam) => {
      return firstPage.hasOlder ? pageParam + 1 : undefined;
    },
    getNextPageParam: () => undefined,
    staleTime: 60 * 60 * 1000,
  });
};

export const useInfiniteTasks = ({
  filterByDevice,
  filterByPopularity,
  limitPerPage,
}: {
  filterByDevice: IFilterByDevice;
  filterByPopularity: IFilterByPopularity;
  limitPerPage: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["tasks", filterByDevice, filterByPopularity, limitPerPage],
    queryFn: ({ pageParam }) =>
      fetchAllTasks({
        filterByDevice,
        filterByPopularity,
        limitPerPage,
        pageParam,
      }),

    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    staleTime: 60 * 60 * 1000,
  });
};

export const useGetSearchResult = ({ searchTerm }: { searchTerm: string }) => {
  return useQuery({
    queryKey: ["search", searchTerm],
    queryFn: searchTerm ? () => getSearchResults({ searchTerm }) : skipToken,
    staleTime: 60 * 60 * 1000,
  });
};

export const useFetchNotifications = ({ userAuth }: { userAuth: boolean }) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: userAuth ? fetchMyNotifications : skipToken,
    staleTime: 1000 * 60 * 60,
  });
};

export const useFetchTaskDetails = ({ taskId }: { taskId: string | undefined }) => {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: taskId ? () => fetchAppDetails({ taskId }) : skipToken,
  });
};

export const useFetchTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    staleTime: 60 * 60 * 1000,
  });
};

export const useFetchLeaderboardUsers = ({ pageParam }: { pageParam: number }) => {
  return useQuery({
    queryKey: ["leaderboard-users", pageParam],
    queryFn: () => getLeaderboardUsers({ pageParam }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 60 * 1000,
  });
};

export const useFetchFrames = () => {
  return useQuery({
    queryKey: ["frames"],
    queryFn: fetchAllFrames,
    staleTime: 60 * 60 * 1000,
  });
};

export const useFetchMusics = () => {
  return useQuery({
    queryKey: ["musics"],
    queryFn: fetchMusics,
    staleTime: 60 * 60 * 1000,
  });
};

export const useFetchOnlineUsers = () => {
  return useQuery({
    queryKey: ["onlines-users"],
    queryFn: getOnlineUsers,
  });
};

export const useFetchUser = ({ userId }: { userId: string | undefined }) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: userId ? () => fetchUserById({ userId }) : skipToken,
    staleTime: 10 * 60 * 1000,
  });
};

export const useFetchUserActivities = ({ userId }: { userId: string | undefined }) => {
  return useQuery({
    queryKey: ["user-activities", userId],
    queryFn: userId ? () => fetchUserActivities({ userId }) : skipToken,
    staleTime: 10 * 60 * 1000,
  });
};
