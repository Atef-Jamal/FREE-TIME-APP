import { BiMenu } from "react-icons/bi";
import { toggleThisEntity } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { sidebareItems } from "../../helper/data";
import { NavLink, useLocation } from "react-router-dom";
import { memo, useCallback, useEffect } from "react";
import { useListenToSocketEvents } from "../../hooks";
import {
  TypeConversation,
  TypePrivateMessage,
} from "../../types/privateChatTypes";
import {
  showPopup,
  updateSidebarUnReadedMsgCount,
} from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";
import messageSoundSrc from "../../assets/images/messageSound.mp3";
import { RiCloseFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { TypeCashedChat } from "../Chats/PrivateChat/SendMessagePrivateChat";

const Sidebar = memo(
  ({
    handleCloseMobileSidebare,
  }: {
    handleCloseMobileSidebare: (open: boolean) => void;
  }) => {
    const currentUser = useAppSelector(
      (state) => state.stateManeger.currentUser
    );
    const onlineUsers = useAppSelector(
      (state) => state.stateManeger.onlineUsers
    );
    const allUnReadedMesseges = useAppSelector(
      (state) => state.stateManeger.allUnReadedMesseges
    );
    const activeConversation = useAppSelector(
      (state) => state.stateManeger.activeConversation
    );
    const resizeSidebare = useAppSelector(
      (state) => state.stateManeger.resizeSidebare
    );
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const location = useLocation();
    const { t } = useTranslation("sidebar");

    const isPrivateChatPageOpen = location.pathname === "/privatechat";

    const handleCollaps = () =>
      dispatch(toggleThisEntity({ entity: "resizeSidebare" }));

    const handleNewPrivateMessage = useCallback(
      (data: TypePrivateMessage) => {
        if (!isPrivateChatPageOpen) {
          dispatch(
            updateSidebarUnReadedMsgCount({
              type: "ADD-ONE",
              userId: data.sender._id,
            })
          );
          const messageSound = new Audio();
          messageSound.src = messageSoundSrc;
          messageSound.play();
        }
        queryClient.setQueryData(
          ["conversations"],
          (old: TypeConversation[]) => {
            if (!old) return;
            const newArry = old.map((conv) => {
              if (data.sender._id === conv.secondParty._id) {
                const isChatRoomWithUserOpen =
                  data.sender._id === activeConversation;
                return {
                  ...conv,
                  lastMessage: data,
                  unreadedCount: isChatRoomWithUserOpen
                    ? conv.unreadedCount
                    : conv.unreadedCount + 1,
                };
              } else {
                return conv;
              }
            });
            newArry.sort((a, b) => {
              if (a.lastMessage?.createdAt && b.lastMessage?.createdAt) {
                if (a.lastMessage?.createdAt > b.lastMessage?.createdAt) {
                  return -1;
                }
                if (a.lastMessage?.createdAt < b.lastMessage?.createdAt) {
                  return 1;
                } else {
                  return 0;
                }
              }
              if (
                onlineUsers.includes(a.secondParty._id) &&
                !onlineUsers.includes(b.secondParty._id)
              ) {
                return -1;
              }
              if (
                !onlineUsers.includes(a.secondParty._id) &&
                onlineUsers.includes(b.secondParty._id)
              ) {
                return 1;
              }
              return 0;
            });
            return newArry;
          }
        );
        queryClient.setQueryData(
          ["private-messages", data.sender._id],
          (old: TypeCashedChat) => {
            if (!old) return;
            return { ...old, messages: [...old.messages, data] };
          }
        );
      },
      [
        queryClient,
        activeConversation,
        onlineUsers,
        dispatch,
        isPrivateChatPageOpen,
      ]
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
          })
        );
      }
    }, [allUnReadedMesseges, dispatch, isPrivateChatPageOpen]);

    useEffect(() => {
      const getAllUnReadedMsgs = async () => {
        try {
          const response = await makeRequest.get(
            "api/conversations/all/all-unreaded-count"
          );
          dispatch(
            updateSidebarUnReadedMsgCount({
              type: "ADD-ALL",
              userId: response.data,
            })
          );
        } catch (error) {
          dispatch(
            showPopup({
              message: handleApiError(error),
              type: "ERROR_GENERAL",
            })
          );
        }
      };

      if (currentUser?._id) {
        getAllUnReadedMsgs();
      }
    }, [currentUser?._id, dispatch]);

    return (
      <div className="sticky top-[85px] sm:top-[55px] overflow-hidden">
        <div
          onClick={handleCollaps}
          className={`sm:hidden ml-auto mr-[6px] w-[51px] h-[40px] flex items-center justify-center rounded-md hover:bg-[#40496975]`}
        >
          <BiMenu className="text-2xl" />
        </div>

        <div className="hidden sm:flex items-center justify-between border-b border-gray-700">
          <span className="text-2xl text-[#74c43f] font-bold">
            FREE
            <span className="text-2xl text-[#d0ddc7] font-bold">TIME</span>
          </span>
          <span
            onClick={() => handleCloseMobileSidebare(false)}
            className="bg-[#489b2f] p-[4px] rounded-sm"
          >
            <RiCloseFill style={{ fontSize: "20px" }} />
          </span>
        </div>
        <ul className="flex flex-col px-1 gap-1 w-full overflow-scroll scrollbar-none mt-2">
          {sidebareItems.map((item, index) => {
            const isMobile = window.innerWidth <= 867;
            if (isMobile) {
              if (
                item.path === "leaderboard" ||
                item.path === "earn" ||
                item.path === "rewards"
              )
                return;
            }
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${
                      isActive ? "bg-[#40496975]" : ""
                    } relative transition-all hover:bg-[#40496975] flex items-center gap-1 py-2 rounded-md`
                  }
                >
                  <span
                    className={`transition-all duration-300 text-[16px] py-1 pl-4 pr-3 sm:px-2 hover:rotate-[360deg]`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`${
                      resizeSidebare && "hidden sm:flex"
                    } font-bold tracking-wide text-gray-400 text-sm `}
                  >
                    {t(item.title)}
                  </span>
                  {currentUser &&
                    allUnReadedMesseges.length > 0 &&
                    item.path === "privatechat" && (
                      <span className="absolute top-2 right-1 w-5 h-5 text-xs font-bold flex items-center justify-center rounded-full bg-[#e23e32]">
                        {allUnReadedMesseges.length}
                      </span>
                    )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
);

export default Sidebar;
