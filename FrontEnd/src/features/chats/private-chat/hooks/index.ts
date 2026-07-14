import { skipToken, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchAllConversations, fetchPrivateChatMessages, fetchUnreadPrivateMessages } from "../services";

export const useFetchUnreadPrivateMsgs = ({ userAuth }: { userAuth: boolean }) => {
  return useQuery({
    queryKey: ["unread-private-messages-count"],
    queryFn: userAuth ? () => fetchUnreadPrivateMessages() : skipToken,
  });
};

export const useInfiniteConversations = ({ userAuth }: { userAuth: boolean }) => {
  return useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: userAuth ? ({ pageParam }) => fetchAllConversations({ pageParam }) : skipToken,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, pageParam) => (lastPage.hasMore ? pageParam + 1 : undefined),
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
  });
};
