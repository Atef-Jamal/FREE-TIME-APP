import { BiMenu } from "react-icons/bi";
import { ICashedConversation, ICashedConversations, IPrivateMessage } from "../../types/privateChatTypes";
import {
  showModal,
  updateThisEntity,
  showPopup,
  updateSidebarUnReadedMsgCount,
} from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { sidebareItems } from "../../helper/data";
import { NavLink, useLocation } from "react-router-dom";
import { lazy, memo, Suspense, useCallback, useEffect } from "react";
import { useListenToSocketEvents } from "../../hooks";
import { handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";
import messageSoundSrc from "../../assets/images/messageSound.mp3";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import Search from "../Search/Search";
import SearchBar from "../Search/SearchBar";

const MusicPlayer = lazy(() => import("../../components/Music/MusicPlayer"));

const Sidebar = memo(() => {
  const allUnReadedMesseges = useAppSelector((state) => state.stateManeger.allUnReadedMesseges);
  const activeConversation = useAppSelector((state) => state.stateManeger.activeConversation);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const sidebarCollapsed = useAppSelector((state) => state.stateManeger.sidebarCollapsed);
  const openMusicModal = useAppSelector((state) => state.stateManeger.openMusicModal);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);
  const { t } = useTranslation("sidebar");
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const isPrivateChatPageOpen = location.pathname === "/privatechat";

  const handleCollaps = () => {
    dispatch(updateThisEntity({ entity: "sidebarCollapsed", value: !sidebarCollapsed }));
  };

  const handleNewPrivateMessage = useCallback(
    (data: IPrivateMessage) => {
      if (!isPrivateChatPageOpen) {
        dispatch(
          updateSidebarUnReadedMsgCount({
            type: "ADD-ONE",
            userId: data.sender._id,
          }),
        );
        const messageSound = new Audio();
        messageSound.src = messageSoundSrc;
        messageSound.play();
      }
      queryClient.setQueryData(["conversations"], (previous: ICashedConversations): ICashedConversations => {
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            return {
              ...page,
              conversations: page.conversations.map((conv) => {
                const isConversationWithUserOpen = data.sender._id === activeConversation;
                if (conv.secondParty._id === data.sender._id) {
                  return {
                    ...conv,
                    lastMessage: data,
                    unreadedCount: isConversationWithUserOpen ? conv.unreadedCount : conv.unreadedCount + 1,
                  };
                }
                return conv;
              }),
            };
          }),
        };
      });
      queryClient.setQueryData(
        ["conversation-messages", data.sender._id],
        (previous: ICashedConversation) => {
          if (!previous) return;
          return { ...previous, messages: [...previous.messages, data] };
        },
      );
    },
    [queryClient, activeConversation, dispatch, isPrivateChatPageOpen],
  );

  useListenToSocketEvents({
    eventsToListen: ["private-message"],
    handlers: [handleNewPrivateMessage],
  });

  useEffect(() => {
    if (isPrivateChatPageOpen && allUnReadedMesseges.length > 0) {
      dispatch(
        updateSidebarUnReadedMsgCount({
          type: "REMOVE-ALL",
        }),
      );
    }
  }, [allUnReadedMesseges, dispatch, isPrivateChatPageOpen]);

  useEffect(() => {
    const getAllUnReadedMsgs = async () => {
      try {
        const response = await makeRequest.get("api/conversations/all/all-unreaded-count");
        dispatch(
          updateSidebarUnReadedMsgCount({
            type: "ADD-ALL",
            userId: response.data,
          }),
        );
      } catch (error) {
        dispatch(
          showPopup({
            message: handleApiError(error),
            type: "ERROR_GENERAL",
          }),
        );
      }
    };

    if (currentUserStatus === "authenticated") {
      getAllUnReadedMsgs();
    }
  }, [currentUserStatus, dispatch]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex h-full w-[80%] max-w-[400px] flex-col gap-y-2 border-r border-r-gray-500 bg-[#29293a] px-2 pt-1 lg:w-full lg:pt-3"
    >
      <div className={`hidden lg:block`}>
        <BiMenu onClick={handleCollaps} className={`${sidebarCollapsed ? "mx-auto" : "ml-auto"} text-2xl`} />
      </div>

      <div onClick={() => dispatch(showModal({ children: <Search /> }))} className="h-10 lg:hidden">
        <SearchBar placeholder={t("search Everything")} onChange={() => {}} readOnly />
      </div>

      {openMusicModal && <Suspense children={<MusicPlayer />} />}

      <ul className="flex w-full flex-col gap-1">
        {sidebareItems.map((item, index) => {
          if (smallScreen) {
            if (item.path === "leaderboard" || item.path === "earn" || item.path === "rewards") return;
          }
          return (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#40496975]" : ""
                  } relative flex items-center gap-x-3 rounded-md px-4 py-2 transition-all hover:bg-[#40496975]`
                }
              >
                <span className={`py-1 transition-all duration-300 hover:rotate-[360deg]`}>{item.icon}</span>
                <span className={`truncate text-sm font-bold tracking-wide text-gray-400`}>
                  {t(item.title)}
                </span>
                {currentUserStatus === "authenticated" &&
                  allUnReadedMesseges.length > 0 &&
                  item.path === "privatechat" && (
                    <span className="absolute right-1 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#e23e32] text-xs font-bold">
                      {allUnReadedMesseges.length + 2}
                    </span>
                  )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default Sidebar;
