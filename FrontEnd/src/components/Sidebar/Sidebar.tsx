import { BiMenu } from "react-icons/bi";
import { toggleThisEntity } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { sidebareItems } from "../../helper/data";
import { NavLink } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useListenToSocketEvents } from "../../hooks";
import { TypePrivateMessage } from "../../types/privateChatTypes";
import {
  showPopup,
  updateSidebarUnReadedMsgCount,
} from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";
import messageSoundSrc from "../../assets/images/messageSound.mp3";
import { RiCloseFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";

const Sidebar = ({
  setOpenSidbareMobile,
}: {
  setOpenSidbareMobile: Dispatch<SetStateAction<boolean>>;
}) => {
  const { currentUser, allUnReadedMesseges, resizeSidebare } = useAppSelector(
    (state) => state.stateManeger
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation("sidebar");
  const messageSound = new Audio();
  messageSound.src = messageSoundSrc;

  const handleCollaps = () =>
    dispatch(toggleThisEntity({ entity: "resizeSidebare" }));

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

  useListenToSocketEvents({
    eventsToListen: ["private-message"],
    handlers: [handleAddNewPrivateMessage],
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
  }, [allUnReadedMesseges, dispatch]);

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

  const handleCloseSidbare = () => {
    setOpenSidbareMobile(false);
  };

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
          onClick={handleCloseSidbare}
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
};

export default Sidebar;
