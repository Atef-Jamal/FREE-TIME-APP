import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";
import { IUser } from "../types/userTypes";
import { IPublicChatItem } from "../types/publicChatTypes";
import { ICashedConversations, IPrivateMessage } from "../types/privateChatTypes";
import { IConversationReadedSocketData } from "../types/othersTypes";
import { useAppDispatch, useAppSelector } from "../context/hooks";
import {
  showModal,
  setOnlineUsers,
  setSocket,
  openToast,
  updateThisEntity,
  setCurrentUser,
  updateCurrentUserStatus,
  disconnectSocket,
  updateSidebarUnReadedMsgCount,
} from "../context/appStateSlice";
import { useListenToSocketEvents } from "./useListenToSocketEvents";
import { axiosRequest, debounce, handleApiError } from "../utilities";
import messageSoundSrc from "../assets/images/messageSound.mp3";
import {
  useInfiniteConversationMsgs,
  useInfiniteConversations,
  useInfinitePublicChatMsges,
} from "../tanstackQuery/queryFetch";
import {
  addNewPrivateMsgCache,
  addNewPublicMsgCache,
  revalidateConversationsCache,
  updateConversationReadCache,
  updateUserCache,
} from "../tanstackQuery/queryCache";

export const useInitialization = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatWithUserId = useAppSelector((state) => state.appState.activeChatWithUserId);
  const currentUserId = useAppSelector((state) => state.appState.currentUser?._id);
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const location = useLocation();

  const userAuth = currentUserStatus === "authenticated";

  const isPrivateChatPageOpen = location.pathname === "/privatechat";
  const redirectQuery = searchParams.get("redirectedfrom");
  const refQuery = searchParams.get("referrerUser");

  const handleUpdateOnlineUsers = useCallback(
    (data: string[]) => {
      const filtered = data.filter((userId) => userId !== "undefined");
      dispatch(setOnlineUsers(filtered));
    },
    [dispatch],
  );

  const handleRecieveNewPublicChatMessage = useCallback(
    (newMessage: IPublicChatItem) => {
      addNewPublicMsgCache({ queryClient, newMessage });
    },
    [queryClient],
  );

  const handleNewPrivateMessage = useCallback(
    (newMessage: IPrivateMessage) => {
      if (!isPrivateChatPageOpen) {
        dispatch(
          updateSidebarUnReadedMsgCount({
            type: "ADD-ONE",
            userId: newMessage.sender._id,
          }),
        );
        new Audio(messageSoundSrc).play();
      }

      const allConversations: ICashedConversations | undefined = queryClient.getQueryData(["conversations"]);

      const isConversationExist = allConversations?.pages.some((page) =>
        page.conversations.some((conv) => conv.secondUser._id === newMessage.sender._id),
      );

      addNewPrivateMsgCache({ queryClient, activeChatWithUserId, isConversationExist, newMessage });
    },
    [queryClient, activeChatWithUserId, dispatch, isPrivateChatPageOpen],
  );

  const handleUserUpdated = useCallback(
    (updatedUser: IUser) => {
      updateUserCache({ queryClient, updatedUser });
    },
    [queryClient],
  );

  const handleConversationReaded = useCallback(
    (data: IConversationReadedSocketData) => {
      updateConversationReadCache({ queryClient, data });
    },
    [queryClient],
  );

  const handleNewUserRegistered = useCallback(() => {
    revalidateConversationsCache({ queryClient });
  }, [queryClient]);

  //prefetch chats
  useInfinitePublicChatMsges();
  useInfiniteConversations({ userAuth });
  useInfiniteConversationMsgs({ userAuth, activeChatWithUserId });

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (!token) {
      const googleAuthToken = searchParams.get("token");
      if (googleAuthToken) {
        token = searchParams.get("token");
        localStorage.setItem("token", googleAuthToken);
        setSearchParams(() => {
          searchParams.delete("token");
          return searchParams;
        });
      }
    }

    const getCurrentUser = async () => {
      try {
        if (token) {
          const response = await axiosRequest.get("api/auth/currentuser");
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
  }, [searchParams, setSearchParams, dispatch]);

  const events = useMemo(
    () => [
      "online-users",
      "public-message",
      "private-message",
      "user-updated",
      "conversation-readed",
      "new-user-registered",
    ],
    [],
  );
  const handlers = useMemo(
    () => [
      handleUpdateOnlineUsers,
      handleRecieveNewPublicChatMessage,
      handleNewPrivateMessage,
      handleUserUpdated,
      handleConversationReaded,
      handleNewUserRegistered,
    ],
    [
      handleUpdateOnlineUsers,
      handleRecieveNewPublicChatMessage,
      handleNewPrivateMessage,
      handleUserUpdated,
      handleConversationReaded,
      handleNewUserRegistered,
    ],
  );

  useListenToSocketEvents({
    eventsToListen: events,
    handlers: handlers,
  });

  useEffect(() => {
    if (currentUserStatus === "pending") return;

    const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
      query: { userId: currentUserId },
    });
    dispatch(setSocket(socket));
    return () => {
      dispatch(disconnectSocket());
    };
  }, [currentUserStatus, currentUserId, dispatch]);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debouncedResize: any = debounce(handleResize, 250);

    window.addEventListener("online", handleNetworkOnline);
    window.addEventListener("offline", handleNetworkOffline);
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("online", handleNetworkOnline);
      window.removeEventListener("offline", handleNetworkOffline);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [dispatch]);
};
