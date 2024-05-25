import { sidebareItems } from "../../helper/data";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useListenToSocketEvent } from "../../hooks";
import { TypePrivateMessage } from "../../types/privateChatTypes";
import {
  showPopup,
  updateSidebarUnReadedMsgCount,
} from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";
import messageSoundSrc from "../../assets/images/messageSound.wav";

const SidebarList = () => {
  const { currentUser, allUnReadedMesseges } = useAppSelector(
    (state) => state.stateManeger
  );
  const dispatch = useAppDispatch();
  const messageSound = new Audio();
  messageSound.src = messageSoundSrc;

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
          status: true,
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    }
  };

  const handleAddNewPrivateMessage = (data: TypePrivateMessage) => {
    if (location.pathname !== "/privatechat") {
      dispatch(
        updateSidebarUnReadedMsgCount({
          type: "ADD-ONE",
          userId: data.sender._id,
        })
      );
      messageSound.play();
    }
  };

  useListenToSocketEvent<TypePrivateMessage>({
    eventToListen: "private-message",
    onUpdate: handleAddNewPrivateMessage,
  });

  useEffect(() => {
    if (
      location.pathname === "/privatechat" &&
      allUnReadedMesseges.length > 0
    ) {
      dispatch(
        updateSidebarUnReadedMsgCount({
          type: "REMOVE-ALL",
        })
      );
    }
  }, [location.pathname, allUnReadedMesseges]);
  useEffect(() => {
    if (currentUser?._id) {
      getAllUnReadedMsgs();
    }
  }, [currentUser?._id]);

  return (
    <ul className="flex flex-col px-1 gap-1 w-full overflow-scroll scrollbar-none">
      {sidebareItems.map((item, index) => {
        return (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `${
                  isActive ? "bg-[#40496975]" : ""
                } transition-all hover:bg-[#40496975] flex items-center gap-1 py-2 rounded-md overflow-hidden`
              }
            >
              <span
                className={` relative transition-all duration-300 text-[16px] py-1 pl-5 pr-4 hover:rotate-[360deg]`}
              >
                {currentUser &&
                  allUnReadedMesseges.length > 0 &&
                  item.path === "privatechat" && (
                    <span className="absolute -top-[6px] right-[3px] w-5 h-5 text-xs font-bold flex items-center justify-center rounded-full bg-[#e23e32]">
                      {allUnReadedMesseges.length}
                    </span>
                  )}
                {item.icon}
              </span>
              <span
                className={"font-bold tracking-wide text-gray-400 text-[14px] "}
              >
                {item.title}
              </span>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarList;
