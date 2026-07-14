import { QueryClient } from "@tanstack/react-query";
import {
  ICashedConversations,
  ICashedSingleConversation,
  IPrivateMessage,
  IUnreadPrivateMsgsCache,
} from "../types";

export const updateTotalUnReadPrivateMsgsCache = ({
  queryClient,
  type,
}: {
  queryClient: QueryClient;
  type: "add-one" | "remove-one" | "remove-all";
}) => {
  return queryClient.setQueryData(
    ["unread-private-messages-count"],
    (previous: IUnreadPrivateMsgsCache | undefined): IUnreadPrivateMsgsCache | undefined => {
      if (!previous) return;
      switch (type) {
        case "add-one":
          return { counts: previous.counts + 1 };
          break;
        case "remove-one":
          return { counts: previous.counts - 1 };
          break;
        case "remove-all":
          return { counts: 0 };
          break;
        default:
          return previous;
          break;
      }
    },
  );
};

export const addPendingPrivateMsgCache = ({
  queryClient,
  secondUserId,
  optimisticMsg,
}: {
  queryClient: QueryClient;
  secondUserId: string | null;
  optimisticMsg: IPrivateMessage;
}) => {
  return queryClient.setQueryData(
    ["conversation-messages", secondUserId],
    (previous: ICashedSingleConversation): ICashedSingleConversation => {
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          if (index === previous.pages.length - 1) {
            return { ...page, messages: [...page.messages, optimisticMsg] };
          }
          return page;
        }),
      };
    },
  );
};

export const addSuccessPrivateMsgCache = ({
  queryClient,
  secondUserId,
  newMessage,
  uniqeIdForRollback,
}: {
  queryClient: QueryClient;
  newMessage: IPrivateMessage;
  secondUserId: string | null;
  uniqeIdForRollback: string;
}) => {
  queryClient.setQueryData(
    ["conversation-messages", secondUserId],
    (previous: ICashedSingleConversation | undefined): ICashedSingleConversation | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => ({
          ...page,
          messages: page.messages.map((msg) => {
            if (msg._id === uniqeIdForRollback) {
              return { ...newMessage, isSended: "SUCCESS" };
            }
            return msg;
          }),
        })),
      };
    },
  );

  queryClient.setQueryData(
    ["conversations"],
    (previous: ICashedConversations | undefined): ICashedConversations | undefined => {
      if (!previous) return;
      const flatedConversations = previous.pages.map((page) => page.conversations).flat();
      const existingConversation = flatedConversations?.find(
        (conv) => conv.secondUser._id === newMessage.receiver._id,
      );

      if (existingConversation) {
        return {
          ...previous,
          pages: previous.pages
            .map((page) => ({
              ...page,
              conversations: page.conversations.filter((conv) => conv._id !== existingConversation._id),
            }))
            .map((page, index) => {
              const updatedConversation = { ...existingConversation, lastMessage: newMessage };
              if (index === 0) {
                return {
                  ...page,
                  conversations: [updatedConversation, ...page.conversations],
                };
              }
              return page;
            }),
        };
      } else {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
  );
};

export const addFailedPrivateMsgCache = ({
  queryClient,
  secondUserId,
  uniqeIdForRollback,
}: {
  queryClient: QueryClient;
  secondUserId: string | null;
  uniqeIdForRollback: string;
}) => {
  return queryClient.setQueryData(
    ["conversation-messages", secondUserId],
    (previous: ICashedSingleConversation | undefined): ICashedSingleConversation | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => ({
          ...page,
          messages: page.messages.map((msg) => {
            if (msg._id === uniqeIdForRollback) {
              return { ...msg, isSended: "FAILED" };
            }
            return msg;
          }),
        })),
      };
    },
  );
};

export const updateConversationReadCache = ({
  queryClient,
  currentUserId,
  secondUserId,
}: {
  queryClient: QueryClient;
  currentUserId: string;
  secondUserId: string;
}) => {
  return queryClient.setQueryData(
    ["conversations"],
    (previous: ICashedConversations | undefined): ICashedConversations | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return {
            ...page,
            conversations: page.conversations.map((conv) => {
              if (conv.secondUser._id === secondUserId) {
                return {
                  ...conv,
                  unreadCounts: {
                    ...conv.unreadCounts,
                    [currentUserId]: 0,
                  },
                };
              }
              return conv;
            }),
          };
        }),
      };
    },
  );
};

export const addReceivedPrivateMsgCache = ({
  queryClient,
  isPrivateChatPageOpen,
  currentUserId,
  secondUserId,
  newMessage,
}: {
  queryClient: QueryClient;
  isPrivateChatPageOpen: boolean;
  currentUserId: string;
  secondUserId: string | null;
  newMessage: IPrivateMessage;
}) => {
  queryClient.setQueryData(
    ["conversation-messages", newMessage.sender._id],
    (previous: ICashedSingleConversation | undefined): ICashedSingleConversation | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          if (index === previous.pages.length - 1)
            return { ...page, messages: [...page.messages, newMessage] };
          return page;
        }),
      };
    },
  );
  queryClient.setQueryData(
    ["conversations"],
    (previous: ICashedConversations | undefined): ICashedConversations | undefined => {
      if (!previous) return;
      const flatedConversations = previous.pages.map((page) => page.conversations).flat();
      const existingConversation = flatedConversations.find(
        (conv) => conv.secondUser._id === newMessage.sender._id,
      );

      if (existingConversation) {
        return {
          ...previous,
          pages: previous.pages
            .map((page) => ({
              ...page,
              conversations: page.conversations.filter((conv) => conv._id !== existingConversation._id),
            }))
            .map((page, index) => {
              const isConversationWithUserOpen =
                existingConversation.secondUser._id === secondUserId && isPrivateChatPageOpen;
              const updatedConversation = {
                ...existingConversation,
                lastMessage: newMessage,
                unreadCounts: {
                  ...existingConversation.unreadCounts,
                  [currentUserId]: isConversationWithUserOpen
                    ? existingConversation.unreadCounts[currentUserId]
                    : existingConversation.unreadCounts[currentUserId] + 1,
                },
              };
              if (index === 0)
                return { ...page, conversations: [updatedConversation, ...page.conversations] };
              return page;
            }),
        };
      } else {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
  );
};
