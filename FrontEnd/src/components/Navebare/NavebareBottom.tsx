import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { GiWantedReward } from "react-icons/gi";
import { RiCloseFill } from "react-icons/ri";
import { MdLeaderboard } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { IoChatbubblesSharp } from "react-icons/io5";
import { RiMoneyPoundBoxFill } from "react-icons/ri";
import { useListenToSocketEvents } from "../../hooks";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { setPublicMsgRedPoint } from "../../context/StateManeger";

interface TypeProps {
  setOpenSidbareMobile: Dispatch<SetStateAction<boolean>>;
  openSidbareMobile: boolean;
}

const NavebareBottom = ({ setOpenSidbareMobile, openSidbareMobile }: TypeProps) => {
  const publicMsgRedPoint = useAppSelector((state) => state.stateManeger.publicMsgRedPoint);
  const isChatOpen = useAppSelector((state) => state.stateManeger.isChatOpen);
  const [privateMsgRedPoint, setPrivateMsgRedPoint] = useState(false);

  const handleToggleMobileSidbare = () => setOpenSidbareMobile((prev) => !prev);
  const dispatch = useAppDispatch();

  const handleNotifyNewPublicMessage = () => {
    if (location.pathname !== "/chat" && !isChatOpen) {
      dispatch(setPublicMsgRedPoint(true));
    }
  };

  const handleNotifyNewPrivateMessage = () => {
    if (location.pathname !== "/privatechat" && !openSidbareMobile) {
      setPrivateMsgRedPoint(true);
    }
  };

  useListenToSocketEvents({
    eventsToListen: ["public-message", "private-message"],
    handlers: [handleNotifyNewPublicMessage, handleNotifyNewPrivateMessage],
  });

  useEffect(() => {
    if (openSidbareMobile) {
      setPrivateMsgRedPoint(false);
    }
  }, [openSidbareMobile, setPrivateMsgRedPoint]);

  return (
    <ul className="sticky bottom-0 z-[10] flex h-[60px] w-full items-center justify-between gap-1 bg-[#2b2b55] lg:hidden">
      <li className="relative flex h-[65px] w-[17%] items-center justify-center">
        {openSidbareMobile && <RiCloseFill className="text-3xl" onClick={handleToggleMobileSidbare} />}
        {!openSidbareMobile && <FaList className="text-xl" onClick={handleToggleMobileSidbare} />}
        {privateMsgRedPoint && (
          <span className="absolute left-[30%] top-[10%] h-3 w-3 rounded-full bg-[#f82929]"></span>
        )}
      </li>

      <li className="h-[60px] flex-1">
        <NavLink
          to={"leaderboard"}
          className={({ isActive }) =>
            `${
              isActive ? "bg-gradient-to-t from-[#d9ff0088] to-[#3e5a2836] text-[#bfbee6]" : ""
            } flex h-full flex-col items-center justify-center gap-1 rounded-md text-center text-xs font-[500] text-gray-200`
          }
        >
          <MdLeaderboard className="text-xl" />
          Leader board
        </NavLink>
      </li>
      <li className="-mt-4 h-[60px] flex-1">
        <NavLink
          to={"earn"}
          className={({ isActive }) =>
            `${
              isActive ? "bg-gradient-to-t from-[#d9ff0088] to-[#3e5a2836] text-[#bfbee6]" : ""
            } flex h-full flex-col items-center justify-center gap-2 rounded-md bg-[#3a3a6b] text-xs font-[500] text-gray-200`
          }
        >
          <RiMoneyPoundBoxFill className="text-2xl" />
          Earn
        </NavLink>
      </li>
      <li className="h-[60px] flex-1">
        <NavLink
          to={"rewards"}
          className={({ isActive }) =>
            `${
              isActive ? "bg-gradient-to-t from-[#d9ff0088] to-[#3e5a2836] text-[#bfbee6]" : undefined
            } flex h-full flex-col items-center justify-center gap-2 rounded-md text-xs font-[500] text-gray-200`
          }
        >
          <GiWantedReward className="text-2xl" />
          Rewards
        </NavLink>
      </li>
      <li className="h-[60px] flex-1">
        <NavLink
          to={"chat"}
          className={({ isActive }) =>
            `${
              isActive ? "bg-gradient-to-t from-[#d9ff0088] to-[#3e5a2836] text-[#bfbee6]" : undefined
            } relative flex h-full flex-col items-center justify-center gap-2 rounded-md text-xs font-[500] text-gray-200`
          }
        >
          {publicMsgRedPoint && (
            <span className="absolute left-[30%] top-[10%] h-3 w-3 rounded-full bg-[#f70606ee]"></span>
          )}
          <IoChatbubblesSharp className="text-2xl" />
          Chat
        </NavLink>
      </li>
    </ul>
  );
};

export default NavebareBottom;
