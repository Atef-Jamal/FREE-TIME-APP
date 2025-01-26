import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { skipToken, useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";
import { IUser } from "../types/userTypes";
import { ICashedPublicChat, IPublicChatItem } from "../types/publicChatTypes";
import { ICashedConversation, ICashedConversations } from "../types/privateChatTypes";
import { IConversationReadedSocketData } from "../types/othersTypes";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import {
  showModal,
  setOnlineUsers,
  setSocket,
  openToast,
  updateThisEntity,
  setCurrentUser,
  updateCurrentUserStatus,
  disconnectSocket,
} from "../context/appStateSlice";
import { useListenToSocketEvents } from "../hooks";
import {
  fetchAllConversations,
  fetchPrivateChatMessages,
  fetchPublicChatMessages,
  makeRequest,
} from "../utils";
import { debounce, handleApiError } from "../utils/common";

// implementing some global Logics her better than inside the Layout component,
// this prevent entire Layout from Re-Rendering unnecessarily

const LogicalComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConversation = useAppSelector((state) => state.appState.activeConversation);
  const currentUserId = useAppSelector((state) => state.appState.currentUser?._id);
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  const timeOutRef = useRef(null);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const redirectQuery = searchParams.get("redirectedfrom");
  const refQuery = searchParams.get("referrerUser");
  const token = localStorage.getItem("token");

  const handleUpdateOnlineUsers = useCallback(
    (data: string[]) => {
      const filtered = data.filter((userId) => userId !== "undefined");
      dispatch(setOnlineUsers(filtered));
    },
    [dispatch],
  );

  const handleRecieveNewPublicChatMessage = useCallback(
    (newMessage: IPublicChatItem) => {
      queryClient.setQueryData(["public-chat-messages"], (previous: ICashedPublicChat): ICashedPublicChat => {
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
      });
    },
    [queryClient],
  );

  const handleUserUpdated = useCallback(
    (updatedUser: IUser) => {
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser._id] });
      queryClient.invalidateQueries({ queryKey: ["live-stats-users"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard-users"] });
      queryClient.setQueryData(["conversations"], (previous: ICashedConversations): ICashedConversations => {
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            return {
              ...page,
              conversations: page.conversations.map((conv) => {
                if (conv.secondParty._id === updatedUser._id) {
                  return { ...conv, secondParty: updatedUser };
                }
                return conv;
              }),
            };
          }),
        };
      });
      queryClient.setQueryData(
        ["conversation-messages", updatedUser._id],
        (previous: ICashedConversation): ICashedConversation | undefined => {
          if (!previous) return;
          return { ...previous, secondUser: updatedUser };
        },
      );
    },
    [queryClient],
  );

  const handleConversationReaded = useCallback(
    (data: IConversationReadedSocketData) => {
      queryClient.setQueryData(["conversation-messages", data.sender], (previous: ICashedConversation) => {
        if (previous) {
          return {
            ...previous,
            messages: previous.messages.map((msg) => ({
              ...msg,
              isRead: true,
            })),
          };
        }
      });
    },
    [queryClient],
  );

  const handleNewUserRegistered = () => {
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  };

  useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn:
      currentUserStatus === "authenticated"
        ? ({ pageParam }) => fetchAllConversations({ pageParam })
        : skipToken,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, pageParam) => (lastPage.hasMore ? pageParam + 1 : undefined),
    staleTime: 60 * 60 * 1000,
  });

  useQuery({
    queryKey: ["conversation-messages", activeConversation],
    queryFn: activeConversation
      ? () => fetchPrivateChatMessages({ secondUserId: activeConversation })
      : skipToken,
    staleTime: 60 * 60 * 1000,
  });

  useInfiniteQuery({
    queryKey: ["public-chat-messages"],
    queryFn: ({ pageParam }) => fetchPublicChatMessages({ pageParam, limit: 15 }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage, _, pageParam) => {
      return firstPage.hasOlder ? pageParam + 1 : undefined;
    },
    getNextPageParam: () => undefined,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        if (token) {
          const response = await makeRequest.get("api/auth/currentuser");
          dispatch(setCurrentUser(response.data));
          dispatch(updateCurrentUserStatus("authenticated"));
        } else {
          dispatch(updateCurrentUserStatus("unauthenticated"));
        }
      } catch (error) {
        dispatch(updateCurrentUserStatus("unauthenticated"));
        dispatch(
          openToast({
            type: "ERROR_GENERAL",
            message: handleApiError(error),
          }),
        );
      }
    };
    getCurrentUser();
  }, [token, dispatch]);

  useListenToSocketEvents({
    eventsToListen: [
      "online-users",
      "public-message",
      "user-updated",
      "conversation-readed",
      "new-user-registered",
    ],
    handlers: [
      handleUpdateOnlineUsers,
      handleRecieveNewPublicChatMessage,
      handleUserUpdated,
      handleConversationReaded,
      handleNewUserRegistered,
    ],
  });

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
      query: { userId: currentUserId },
    });
    dispatch(setSocket(socket));
    return () => {
      dispatch(disconnectSocket());
    };
  }, [currentUserId, dispatch]);

  useEffect(() => {
    if (refQuery && currentUserStatus === "unauthenticated") {
      dispatch(showModal("register-modal"));
    }
  }, [dispatch, refQuery, currentUserStatus]);

  useEffect(() => {
    if (redirectQuery) {
      let popupMessage = "";
      if (redirectQuery === "logout") {
        popupMessage = "Logout successfull";
      }
      if (redirectQuery === "login") {
        popupMessage = "Login successfull";
      }
      if (redirectQuery === "signup") {
        popupMessage = "Sign Up successfull";
      }
      if (popupMessage) {
        dispatch(
          openToast({
            message: popupMessage,
            type: "SUCESS",
          }),
        );
        setSearchParams(() => {
          searchParams.delete("redirectedfrom", redirectQuery);
          return searchParams;
        });
      }
    }
  }, [redirectQuery, searchParams, setSearchParams, dispatch]);

  useEffect(() => {
    const handleNetworkOnline = () => {
      dispatch(openToast({ message: "Back online", type: "SUCESS" }));
    };

    const handleNetworkOffline = () => {
      dispatch(openToast({ message: "No internet connection", type: "ERROR_GENERAL" }));
    };

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        dispatch(updateThisEntity({ entity: "smallScreen", value: true }));
      } else {
        dispatch(updateThisEntity({ entity: "smallScreen", value: false }));
      }
    };

    const debouncedResize = debounce(handleResize, 100, timeOutRef);

    window.addEventListener("online", handleNetworkOnline);
    window.addEventListener("offline", handleNetworkOffline);
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("online", handleNetworkOnline);
      window.removeEventListener("offline", handleNetworkOffline);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [dispatch]);

  return <></>;
};

export default LogicalComponent;
