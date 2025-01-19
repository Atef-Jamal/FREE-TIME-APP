import { BiMenu } from "react-icons/bi";
import { openModel, updateThisEntity } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { sidebareItems } from "../../helper/data";
import { NavLink, useLocation } from "react-router-dom";
import { lazy, memo, Suspense, useCallback, useEffect } from "react";
import { useListenToSocketEvents } from "../../hooks";
import { TypeCashedConversations, TypePrivateMessage } from "../../types/privateChatTypes";
import { showPopup, updateSidebarUnReadedMsgCount } from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";
import messageSoundSrc from "../../assets/images/messageSound.mp3";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { TypeCashedChat } from "../Chats/PrivateChat/SendMessagePrivateChat";
import Search from "../Search/Search";
import SearchBar from "../Search/SearchBar";
const MusicPlayer = lazy(() => import("../../components/Music/MusicPlayer"));

const Sidebar = memo(() => {
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const allUnReadedMesseges = useAppSelector((state) => state.stateManeger.allUnReadedMesseges);
  const activeConversation = useAppSelector((state) => state.stateManeger.activeConversation);
  const resizeSidebare = useAppSelector((state) => state.stateManeger.resizeSidebare);
  const openMusicModal = useAppSelector((state) => state.stateManeger.openMusicModal);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { t } = useTranslation("sidebar");

  const isPrivateChatPageOpen = location.pathname === "/privatechat";

  const handleCollaps = () => {
    dispatch(updateThisEntity({ entity: "resizeSidebare", value: !resizeSidebare }));
  };

  const handleNewPrivateMessage = useCallback(
    (data: TypePrivateMessage) => {
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
      queryClient.setQueryData(
        ["conversations"],
        (previous: TypeCashedConversations): TypeCashedConversations => {
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
        },
      );
      queryClient.setQueryData(["conversation-messages", data.sender._id], (previous: TypeCashedChat) => {
        if (!previous) return;
        return { ...previous, messages: [...previous.messages, data] };
      });
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
      className="flex h-full w-[250px] flex-col gap-y-2 bg-[#29293a] px-2 pt-1 lg:w-full lg:pt-3"
    >
      <div className={`hidden lg:block`}>
        <BiMenu onClick={handleCollaps} className={`${resizeSidebare ? "mx-auto" : "ml-auto"} text-2xl`} />
      </div>

      <div
        onClick={() => dispatch(openModel({ status: true, children: <Search /> }))}
        className="h-10 lg:hidden"
      >
        <SearchBar placeholder={t("search Everything")} onChange={() => {}} readOnly />
      </div>

      {openMusicModal && smallScreen && <Suspense children={<MusicPlayer />} />}

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
