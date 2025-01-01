import { BiMenu } from "react-icons/bi";
import { toggleThisEntity } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { sidebareItems } from "../../helper/data";
import { NavLink, useLocation } from "react-router-dom";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useListenToSocketEvents } from "../../hooks";
import { TypeCashedConversations, TypePrivateMessage } from "../../types/privateChatTypes";
import { showPopup, updateSidebarUnReadedMsgCount } from "../../context/StateManeger";
import { debounce, handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";
import messageSoundSrc from "../../assets/images/messageSound.mp3";
import { RiCloseFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { TypeCashedChat } from "../Chats/PrivateChat/SendMessagePrivateChat";

interface TypeProps {
  handleCloseMobileSidebare: (open: boolean) => void;
}

const Sidebar = memo(({ handleCloseMobileSidebare }: TypeProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const allUnReadedMesseges = useAppSelector((state) => state.stateManeger.allUnReadedMesseges);
  const activeConversation = useAppSelector((state) => state.stateManeger.activeConversation);
  const resizeSidebare = useAppSelector((state) => state.stateManeger.resizeSidebare);
  const timeOutRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 867);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { t } = useTranslation("sidebar");

  const isPrivateChatPageOpen = location.pathname === "/privatechat";

  const handleCollaps = () => dispatch(toggleThisEntity({ entity: "resizeSidebare" }));

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
        }
      );
      queryClient.setQueryData(["private-messages", data.sender._id], (old: TypeCashedChat) => {
        if (!old) return;
        return { ...old, messages: [...old.messages, data] };
      });
    },
    [queryClient, activeConversation, dispatch, isPrivateChatPageOpen]
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
        const response = await makeRequest.get("api/conversations/all/all-unreaded-count");
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 867) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    const debounced = debounce(handleResize, 100, timeOutRef);
    window.addEventListener("resize", debounced);
    return () => window.removeEventListener("resize", debounced);
  }, []);

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
        <span onClick={() => handleCloseMobileSidebare(false)} className="bg-[#489b2f] p-[4px] rounded-sm">
          <RiCloseFill style={{ fontSize: "20px" }} />
        </span>
      </div>
      <ul className="flex flex-col px-1 gap-1 w-full overflow-scroll scrollbar-none mt-2">
        {sidebareItems.map((item, index) => {
          if (isMobile) {
            if (item.path === "leaderboard" || item.path === "earn" || item.path === "rewards") return;
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
                {currentUser && allUnReadedMesseges.length > 0 && item.path === "privatechat" && (
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
});

export default Sidebar;
