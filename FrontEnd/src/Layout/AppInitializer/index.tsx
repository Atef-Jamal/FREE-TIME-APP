import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../context/hooks";
import {
  openToast,
  setCurrentUser,
  updateCurrentUserStatus,
  selectActiveSecondUserId,
  selectUserAuth,
} from "../../context/appStateSlice";
import { handleApiError } from "../../utils";

import { useSocketEventBinds } from "../../hooks/useSocketEventBinds";
import { useCallbackHandlers } from "../../hooks/useCallbackHandlers";
import { useWindowEventListeners } from "../../hooks/useWindowEventListeners";
import { axiosRequest } from "../../lib/axios";
import { useFetchActiveGuestsCount, useFetchOnlineUsersData } from "../../features/user/hooks";
import { useInfinitePublicChatMsges } from "../../features/chats/public-chat/hooks";
import {
  useInfiniteConversationMsgs,
  useInfiniteConversations,
} from "../../features/chats/private-chat/hooks";

export const AppInitializer = () => {
  const secondUserId = useAppSelector(selectActiveSecondUserId);
  const userAuth = useAppSelector(selectUserAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) return;

    const getCurrentUser = async () => {
      try {
        const response = await axiosRequest.get("api/auth/currentuser");
        dispatch(setCurrentUser(response.data));
        dispatch(updateCurrentUserStatus("authenticated"));
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
  }, [dispatch]);

  useCallbackHandlers();

  useFetchActiveGuestsCount();
  useFetchOnlineUsersData();
  useInfinitePublicChatMsges();
  useInfiniteConversations({ userAuth: userAuth === "authenticated" });
  useInfiniteConversationMsgs({ userAuth: userAuth === "authenticated", secondUserId });

  useSocketEventBinds();
  useWindowEventListeners();

  return null;
};
