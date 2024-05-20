import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { sidebareItems } from "../../helper/data";
import {
  setAllUnReadedMesseges,
  showPopup,
  toggleThisEntity,
} from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import messageSoundSrc from "../../assets/images/messageSound.wav";
import { makeRequest } from "../../utils";
import { handleApiError } from "../../utils/common";

import { TypePrivateMessage } from "../../types/privateChatTypes";
import { useListenToSocketEvent } from "../../hooks";

const Sidebar = () => {
  const { resizeSidebare, currentUser, allUnReadedMesseges } = useAppSelector(
    (state) => state.stateManeger
  );

  const dispatch = useAppDispatch();

  const messageSound = new Audio();
  messageSound.src = messageSoundSrc;

  useEffect(() => {
    const getAllUnReadedMsgs = async () => {
      if (!currentUser) {
        return;
      }
      try {
        const response = await makeRequest.get(
          "api/conversations/all/all-unreaded-count"
        );
        dispatch(
          setAllUnReadedMesseges({ type: "ADD-ALL", userId: response.data })
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
    if (currentUser) {
      getAllUnReadedMsgs();
    }
  }, [currentUser?._id]);

  useListenToSocketEvent<TypePrivateMessage>({
    eventToListen: "private-message",
    onUpdate: (data) => {
      if (location.pathname.includes(data.sender._id) === false) {
        dispatch(
          setAllUnReadedMesseges({ type: "ADD-ONE", userId: data.sender._id })
        );
        messageSound.play();
      }
    },
  });

  return (
    <div
      style={{
        height: `calc(100dvh - 76px)`,
      }}
      className={`transition-all bg-[#29293a] ${
        resizeSidebare ? "w-[80px]" : "w-[250px]"
      } sticky top-[75px] sm:hidden py-4 border-r border-r-gray-700`}
    >
      <div
        onClick={() => dispatch(toggleThisEntity({ entity: "resizeSidebare" }))}
        className={`${
          !resizeSidebare ? "ml-auto mr-1" : "mx-auto"
        } p-[10px] w-[65px] flex items-center justify-center rounded-md mb-2 hover:bg-[#40496975] `}
      >
        <BiMenu className="text-2xl" />
      </div>

      <ul className="flex flex-col px-1 gap-1 w-full overflow-scroll scrollbar-none">
        {sidebareItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `${isActive ? "bg-[#40496975]" : ""}  ${
                  resizeSidebare ? "self-center pl-0" : ""
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
              {!resizeSidebare && (
                <span
                  className={
                    "font-bold tracking-wide text-gray-400 text-[14px] "
                  }
                >
                  {item.title}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
