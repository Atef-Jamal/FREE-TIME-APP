import { QueryClient } from "@tanstack/react-query";
import type {
  IUser,
  ICashedLiveStatsUsers,
  ICashedPublicChat,
  ICashedConversations,
  ICashedSingleConversation,
  ICashedNotificaions,
  IPublicChatItem,
  IPublicChatMessage,
  INotifications,
  IPrivateMessage,
  ITestimonial,
  IConversation,
} from "../types";

import { v4 as uuidV4 } from "uuid";

export const updateUserCache = ({
  queryClient,
  updatedUser,
}: {
  queryClient: QueryClient;
  updatedUser: IUser;
}) => {
  queryClient.invalidateQueries({ queryKey: ["user", updatedUser._id] });
  queryClient.invalidateQueries({ queryKey: ["live-stats-users"] });
  queryClient.invalidateQueries({ queryKey: ["leaderboard-users"] });
  queryClient.setQueryData(
    ["conversations"],
    (previous: ICashedConversations): ICashedConversations | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return {
            ...page,
            conversations: page.conversations.map((conv) => {
              if (conv.secondUser._id === updatedUser._id) {
                return { ...conv, secondUser: updatedUser };
              }
              return conv;
            }),
          };
        }),
      };
    },
  );
  queryClient.setQueryData(
    ["conversation-messages", updatedUser._id],
    (previous: ICashedSingleConversation): ICashedSingleConversation | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return { ...page, secondUser: updatedUser };
        }),
      };
    },
  );
  return;
};

export const updateNotificationsCollectCache = ({
  queryClient,
  notificationId,
}: {
  queryClient: QueryClient;
  notificationId: string;
}) => {
  return queryClient.setQueryData(
    ["notifications"],
    (previous: ICashedNotificaions): ICashedNotificaions | undefined => {
      if (!previous) return;
      return previous.map((item) => {
        if (item._id === notificationId) {
          return { ...item, isCollected: true };
        }
        return item;
      });
    },
  );
};

export const updateNotificationsIsReadCache = ({ queryClient }: { queryClient: QueryClient }) => {
  return queryClient.setQueryData(
    ["notifications"],
    (previous: ICashedNotificaions): ICashedNotificaions | undefined => {
      if (!previous) return;
      return previous.map((notify) => {
        return { ...notify, isRead: true };
      });
    },
  );
};

export const addNewNotificationCache = ({
  queryClient,
  newNotification,
}: {
  queryClient: QueryClient;
  newNotification: INotifications;
}) => {
  return queryClient.setQueryData(
    ["notifications"],
    (previous: ICashedNotificaions): ICashedNotificaions | undefined => {
      if (!previous) return;
      return [newNotification, ...previous];
    },
  );
};

export const addNewPublicMsgCache = ({
  queryClient,
  newMessage,
}: {
  queryClient: QueryClient;
  newMessage: IPublicChatItem;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          if (index === previous.pages.length - 1) {
            return {
              ...page,
              messages: [...page.messages, newMessage],
            };
          }
          return page;
        }),
      };
    },
  );
};

export const updateConversationReadCache = ({
  queryClient,
  data,
}: {
  queryClient: QueryClient;
  data: { sender: string; receiver: string };
}) => {
  return queryClient.setQueryData(
    ["conversation-messages", data.sender],
    (previous: ICashedSingleConversation): ICashedSingleConversation | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => ({
          ...page,
          messages: page.messages.map((msg) => ({ ...msg, isRead: true })),
        })),
      };
    },
  );
};

export const revalidateConversationsCache = ({ queryClient }: { queryClient: QueryClient }) => {
  return queryClient.invalidateQueries({ queryKey: ["conversations"] });
};

export const updateCurrentUserCache = ({
  queryClient,
  currentUser,
}: {
  queryClient: QueryClient;
  currentUser: IUser;
}) => {
  queryClient.setQueryData(
    ["live-stats-users"],
    (previous: ICashedLiveStatsUsers): ICashedLiveStatsUsers | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return {
            ...page,
            users: page.users.map((user) => {
              if (user._id === currentUser._id) {
                return currentUser;
              }
              return user;
            }),
          };
        }),
      };
    },
  );
  queryClient.invalidateQueries({ queryKey: ["leaderboard-users"] });
  return;
};

export const updateConversationUnreadCountCache = ({
  queryClient,
  activeChatId,
}: {
  queryClient: QueryClient;
  activeChatId: string | null;
}) => {
  return queryClient.setQueryData(
    ["conversations"],
    (previous: ICashedConversations): ICashedConversations | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return {
            ...page,
            conversations: page.conversations.map((conv) => {
              if (conv.secondUser._id === activeChatId) {
                return { ...conv, unReadCount: 0 };
              }
              return conv;
            }),
          };
        }),
      };
    },
  );
};

export const addPendingPrivateMsgCache = ({
  queryClient,
  activeChatId,
  optimisticMsg,
}: {
  queryClient: QueryClient;
  activeChatId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optimisticMsg: any;
}) => {
  return queryClient.setQueryData(
    ["conversation-messages", activeChatId],
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
  activeChatId,
  data,
  uniqeIdForRollback,
}: {
  queryClient: QueryClient;
  data: IPrivateMessage;
  activeChatId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uniqeIdForRollback: string;
}) => {
  queryClient.setQueryData(
    ["conversation-messages", activeChatId],
    (previous: ICashedSingleConversation): ICashedSingleConversation | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => ({
          ...page,
          messages: page.messages.map((msg) => {
            if (msg._id === uniqeIdForRollback) {
              return { ...data, isSended: "SUCCESS" };
            }
            return msg;
          }),
        })),
      };
    },
  );
  queryClient.setQueryData(
    ["conversations"],
    (previous: ICashedConversations): ICashedConversations | undefined => {
      if (!previous) return;
      const isConversationExistOnTheList = previous.pages
        .map((page) => page.conversations)
        .flat()
        .find((conv) => conv.secondUser._id === data.receiver._id);
      if (isConversationExistOnTheList)
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            return {
              ...page,
              conversations: page.conversations
                .map((conv) => {
                  if (conv.secondUser._id === data.receiver._id) {
                    return { ...conv, lastMessage: data };
                  }
                  return conv;
                })
                .sort((a, b) => {
                  if (a.lastMessage && b.lastMessage) {
                    return a.lastMessage.createdAt > b.lastMessage.createdAt ? -1 : 1;
                  }
                  return 0;
                }),
            };
          }),
        };
      return {
        ...previous,
        pages: previous.pages.map((page, i) => {
          const isFirstPage = i === 0;
          const newConversation: IConversation = {
            _id: data.conversationId,
            lastMessage: data,
            secondUser: data.receiver,
            unReadCount: 0,
          };
          if (isFirstPage) {
            return {
              ...page,
              conversations: [newConversation, ...page.conversations],
            };
          }
          return page;
        }),
      };
    },
  );
  return;
};

export const addNewPrivateMsgCache = ({
  queryClient,
  isConversationExist,
  activeChatId,
  newMessage,
}: {
  queryClient: QueryClient;
  isConversationExist: boolean | undefined;
  activeChatId: string | null;
  newMessage: IPrivateMessage;
}) => {
  queryClient.setQueryData(["conversations"], (previous: ICashedConversations): ICashedConversations => {
    if (isConversationExist) {
      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return {
            ...page,
            conversations: page.conversations
              .map((conv) => {
                const isConversationWithUserOpen = conv.secondUser._id === activeChatId;
                if (conv.secondUser._id === newMessage.sender._id) {
                  return {
                    ...conv,
                    lastMessage: newMessage,
                    unReadCount: isConversationWithUserOpen ? conv.unReadCount : conv.unReadCount + 1,
                  };
                }
                return conv;
              })
              .sort((a, b) => {
                if (a.lastMessage && b.lastMessage) {
                  return a.lastMessage.createdAt > b.lastMessage.createdAt ? -1 : 1;
                }
                return 0;
              }),
          };
        }),
      };
    }
    return {
      ...previous,
      pages: previous.pages.map((page, index) => {
        const firstPage = index === 0;
        const newConversation = {
          _id: newMessage.conversationId,
          lastMessage: newMessage,
          secondUser: newMessage.sender,
          unReadCount: newMessage.sender._id === activeChatId ? 0 : 1,
        };
        if (firstPage)
          return {
            ...page,
            conversations: [newConversation, ...page.conversations],
          };
        return page;
      }),
    };
  });
  queryClient.setQueryData(
    ["conversation-messages", newMessage.sender._id],
    (previous: ICashedSingleConversation): ICashedSingleConversation | undefined => {
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
  return;
};

export const addFailedPrivateMsgCache = ({
  queryClient,
  activeChatId,
  uniqeIdForRollback,
}: {
  queryClient: QueryClient;
  activeChatId: string | null;
  uniqeIdForRollback: string;
}) => {
  return queryClient.setQueryData(
    ["conversation-messages", activeChatId],
    (previous: ICashedSingleConversation): ICashedSingleConversation | undefined => {
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

export const deletePublicMsgCache = ({
  queryClient,
  deletedMessage,
}: {
  queryClient: QueryClient;
  deletedMessage: IPublicChatMessage;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return {
            ...page,
            messages: page.messages.map((msg) => {
              if (msg._id === deletedMessage._id) {
                return { ...deletedMessage, _id: uuidV4() };
              }
              return msg;
            }),
          };
        }),
      };
    },
  );
};

export const updatePublicMsgCache = ({
  queryClient,
  newMessage,
}: {
  queryClient: QueryClient;
  newMessage: IPublicChatMessage;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;

      return {
        ...previous,
        pages: previous.pages.map((page) => {
          return {
            ...page,
            messages: page.messages.map((msg) => {
              if (msg._id === newMessage._id) {
                return newMessage;
              }
              return msg;
            }),
          };
        }),
      };
    },
  );
};

export const addPendingPublicMsgCache = ({
  queryClient,
  optimisticMsg,
}: {
  queryClient: QueryClient;
  optimisticMsg: IPublicChatMessage;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;
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
export const addSuccessPublicMsgCache = ({
  queryClient,
  uniqeIdForRollback,
  newMessage,
}: {
  queryClient: QueryClient;
  newMessage: IPublicChatMessage;
  uniqeIdForRollback: string;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          if (index === previous.pages.length - 1) {
            return {
              ...page,
              messages: page.messages.map((msg) => {
                if (msg.type === "MESSAGE" && msg._id === uniqeIdForRollback) {
                  return { ...newMessage, isSended: "SUCCESS" };
                }
                return msg;
              }),
            };
          }
          return page;
        }),
      };
    },
  );
};

export const addFailedPublicMsgCache = ({
  queryClient,
  failedMessage,
  uniqeIdForRollback,
}: {
  queryClient: QueryClient;
  failedMessage: IPublicChatItem;
  uniqeIdForRollback: string;
}) => {
  return queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          if (index === previous.pages.length - 1) {
            return {
              ...page,
              messages: page.messages.map((msg) => {
                if (msg._id === uniqeIdForRollback) {
                  return failedMessage;
                }
                return msg;
              }),
            };
          }
          return page;
        }),
      };
    },
  );
};

export const addTestimonialCashe = ({
  queryClient,
  newTestimonial,
}: {
  queryClient: QueryClient;
  newTestimonial: ITestimonial;
}) => {
  return queryClient.setQueryData(["testimonials"], (old: ITestimonial[]) => {
    return [newTestimonial, ...old];
  });
};
