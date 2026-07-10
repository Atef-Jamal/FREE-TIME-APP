import { QueryClient } from "@tanstack/react-query";
import { v4 as uuidV4 } from "uuid";
import type {
  IUser,
  // ICashedLiveStatsUsers,
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
  IUnreadPrivateMsgsCache,
} from "../types";

// export const updateCurrentUserCache = ({
//   queryClient,
//   updatedUser,
// }: {
//   queryClient: QueryClient;
//   updatedUser: IUser;
// }) => {
//   queryClient.setQueryData(
//     ["live-stats-users"],
//     (previous: ICashedLiveStatsUsers | undefined): ICashedLiveStatsUsers | undefined => {
//       if (!previous) return;
//       return {
//         ...previous,
//         pages: previous.pages.map((page) => {
//           return {
//             ...page,
//             users: page.users.map((user) => {
//               if (user._id === updatedUser._id) {
//                 return updatedUser;
//               }
//               return user;
//             }),
//           };
//         }),
//       };
//     },
//   );
//   queryClient.invalidateQueries({ queryKey: ["leaderboard-users"] });
//   return;
// };

export const updateUserCache = ({
  queryClient,
  updatedUser,
}: {
  queryClient: QueryClient;
  updatedUser: IUser;
}) => {
  queryClient.invalidateQueries({ queryKey: ["live-stats-users"] });
  queryClient.invalidateQueries({ queryKey: ["leaderboard-users"] });

  queryClient.setQueryData(["user", updatedUser._id], () => {
    return updatedUser;
  });

  queryClient.setQueryData(
    ["public-chat-messages"],
    (previous: ICashedPublicChat | undefined): ICashedPublicChat | undefined => {
      if (!previous) return;
      return {
        ...previous,
        pages: previous.pages.map((page) => ({
          ...page,
          messages: page.messages.map((message) => {
            if (message.sender._id === updatedUser._id) {
              return {
                ...message,
                sender: updatedUser,
              };
            }
            return message;
          }),
        })),
      };
    },
  );

  queryClient.setQueryData(
    ["conversations"],
    (previous: ICashedConversations | undefined): ICashedConversations | undefined => {
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
  return;
};

export const updateTotalGuestsCache = ({
  queryClient,
  totalGuests,
}: {
  queryClient: QueryClient;
  totalGuests: number;
}) => {
  queryClient.setQueryData(["total-guests"], () => {
    return totalGuests;
  });
};

export const updateNotificationsCache = ({
  queryClient,
  notification,
}: {
  queryClient: QueryClient;
  notification: INotifications;
}) => {
  return queryClient.setQueryData(
    ["notifications"],
    (previous: ICashedNotificaions | undefined): ICashedNotificaions | undefined => {
      if (!previous) return;
      return previous.map((item) => {
        if (item._id === notification._id) {
          return notification;
        }
        return item;
      });
    },
  );
};

export const updateNotificationsIsReadCache = ({ queryClient }: { queryClient: QueryClient }) => {
  return queryClient.setQueryData(
    ["notifications"],
    (previous: ICashedNotificaions | undefined): ICashedNotificaions | undefined => {
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
    (previous: ICashedNotificaions | undefined): ICashedNotificaions | undefined => {
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
      const conversations: ICashedConversations | undefined = queryClient.getQueryData(["conversations"]);
      const flatedConversations = conversations?.pages.map((page) => page.conversations).flat();
      const findedConversation = flatedConversations?.find(
        (conv) => conv.secondUser._id === newMessage.receiver._id,
      );

      if (findedConversation)
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            return {
              ...page,
              conversations: page.conversations.map((conv) => {
                if (conv.secondUser._id === newMessage.receiver._id) {
                  return {
                    ...conv,
                    lastMessage: newMessage,
                    unreadCounts: {
                      ...conv.unreadCounts,
                      [newMessage.receiver._id]: conv.unreadCounts[newMessage.receiver._id] + 1,
                    },
                  };
                }
                return conv;
              }),
            };
          }),
        };
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          const newConversation: IConversation = {
            _id: newMessage.conversation,
            lastMessage: newMessage,
            conversationName: "",
            secondUser: newMessage.receiver,
            unreadCounts: {
              [newMessage.sender._id]: 0,
              [newMessage.receiver._id]: 1,
            },
          };
          if (index === 0) {
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
      const conversations: ICashedConversations | undefined = queryClient.getQueryData(["conversations"]);
      const flatedConversations = conversations?.pages.map((page) => page.conversations).flat();
      const findedConversation = flatedConversations?.find(
        (conv) => conv.secondUser._id === newMessage.sender._id,
      );

      if (findedConversation) {
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            return {
              ...page,
              conversations: page.conversations.map((conv) => {
                const isConversationWithUserOpen =
                  conv.secondUser._id === secondUserId && isPrivateChatPageOpen;
                if (conv.secondUser._id === newMessage.sender._id) {
                  return {
                    ...conv,
                    lastMessage: newMessage,
                    unreadCounts: {
                      ...conv.unreadCounts,
                      [currentUserId]: isConversationWithUserOpen
                        ? conv.unreadCounts[currentUserId]
                        : conv.unreadCounts[currentUserId] + 1,
                    },
                  };
                }
                return conv;
              }),
            };
          }),
        };
      }
      return {
        ...previous,
        pages: previous.pages.map((page, index) => {
          const count = newMessage.sender._id === secondUserId && isPrivateChatPageOpen ? 0 : 1;
          const newConversation = {
            _id: newMessage.conversation,
            conversationName: "",
            secondUser: newMessage.sender,
            lastMessage: newMessage,
            unreadCounts: {
              [newMessage.receiver._id]: count,
              [newMessage.sender._id]: 0,
            },
          };
          if (index === 0) return { ...page, conversations: [newConversation, ...page.conversations] };
          return page;
        }),
      };
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
