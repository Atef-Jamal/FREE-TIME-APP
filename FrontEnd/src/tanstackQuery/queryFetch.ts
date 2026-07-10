/* eslint-disable @tanstack/query/exhaustive-deps */
import { keepPreviousData, skipToken, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchAllConversations,
  fetchAllFrames,
  fetchAllOffers,
  fetchOfferDetails,
  fetchMusics,
  fetchMyNotifications,
  fetchPrivateChatMessages,
  fetchPublicChatMessages,
  fetchTestimonials,
  fetchUserById,
  fetchTopUser,
  // fetchOnlineUsersIds,
  fetchOnlineUsersData,
  fetchLiveStatsUsers,
  getLeaderboardUsers,
  getSearchResults,
} from "../services";

import type { IFilterByDevice, IFilterByPopularity } from "../types";
import { fetchUserActivities } from "../services/usersService";
import { fetchUnreadPrivateMessages } from "../services/chatService";

export const useInfiniteLiveStatsUsers = () => {
  return useInfiniteQuery({
    queryKey: ["live-stats-users"],
    queryFn: ({ pageParam }) => fetchLiveStatsUsers({ pageParam }),
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
      return firstPage.hasMore ? pageParam + 1 : undefined;
    },
    getNextPageParam: () => undefined,
    staleTime: 60 * 60 * 1000,
  });
};

export const useFetchUnreadPrivateMsgs = ({ userAuth }: { userAuth: boolean }) => {
  return useQuery({
    queryKey: ["unread-private-messages-count"],
    queryFn: userAuth ? () => fetchUnreadPrivateMessages() : skipToken,
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
  secondUserId,
}: {
  userAuth: boolean;
  secondUserId: string | null;
}) => {
  return useInfiniteQuery({
    queryKey: ["conversation-messages", secondUserId],
    queryFn:
      userAuth && secondUserId
        ? ({ pageParam }) => fetchPrivateChatMessages({ pageParam, secondUserId })
        : skipToken,
    initialPageParam: 1,
    getPreviousPageParam: (firstPage, _, pageParam) => {
      return firstPage.hasMore ? pageParam + 1 : undefined;
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
    queryKey: ["offers", filterByDevice, filterByPopularity, limitPerPage],
    queryFn: ({ pageParam }) =>
      fetchAllOffers({
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

export const useFetchOfferDetails = ({ offerId }: { offerId: string | undefined }) => {
  return useQuery({
    queryKey: ["offers", offerId],
    queryFn: offerId ? () => fetchOfferDetails({ offerId }) : skipToken,
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

export const useFetchOnlineUsersData = () => {
  return useQuery({
    queryKey: ["onlines-users-data"],
    queryFn: fetchOnlineUsersData,
    staleTime: 60 * 60 * 1000,
  });
};

export const useFetchUser = ({ userId }: { userId: string | undefined }) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: userId ? () => fetchUserById({ userId }) : skipToken,
    staleTime: 10 * 60 * 1000,
  });
};

export const useFetchTopUser = () => {
  return useQuery({
    queryKey: ["top-user"],
    queryFn: fetchTopUser,
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
