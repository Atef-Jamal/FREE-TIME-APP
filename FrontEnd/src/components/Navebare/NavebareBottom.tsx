import { Dispatch, SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { GiWantedReward } from "react-icons/gi";
import { MdLeaderboard } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { IoChatbubblesSharp } from "react-icons/io5";
import { RiMoneyPoundBoxFill } from "react-icons/ri";

const NavebareBottom = ({
  setOpenSidbareMobile,
}: {
  setOpenSidbareMobile: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleToggleMobileSidbare = () => setOpenSidbareMobile((prev) => !prev);

  return (
    <ul className="w-full flex items-center justify-between gap-1">
      <li className="w-[17%] h-[65px] flex items-center justify-center">
        <FaList className="text-xl" onClick={handleToggleMobileSidbare} />
      </li>

      <li className="flex-1 h-[60px]">
        <NavLink
          to={"leaderboard"}
          className={({ isActive }) =>
            `${
              isActive
                ? " bg-gradient-to-t from-[#d9ff0088] to-[#3e5a2836] text-[#bfbee6]"
                : ""
            } h-full flex flex-col items-center justify-center text-center  rounded-md gap-1 text-gray-200 text-xs font-[500]`
          }
        >
          <MdLeaderboard className="text-xl" />
          Leader board
        </NavLink>
      </li>
      <li className="flex-1 h-[60px] -mt-4">
        <NavLink
          to={"earn"}
          className={({ isActive }) =>
            `${
              isActive
                ? " bg-gradient-to-t from-[#d9ff0088] to-[#3e5a2836] text-[#bfbee6]"
                : ""
            }  flex flex-col items-center justify-center gap-2 text-gray-200 text-xs font-[500] bg-[#3a3a6b] h-full rounded-md`
          }
        >
          <RiMoneyPoundBoxFill className="text-2xl" />
          Earn
        </NavLink>
      </li>
      <li className="flex-1 h-[60px]">
        <NavLink
          to={"rewards"}
          className={({ isActive }) =>
            `${
              isActive
                ? " bg-gradient-to-t from-[#d9ff0088] to-[#3e5a2836] text-[#bfbee6]"
                : undefined
            } flex flex-col items-center justify-center gap-2 text-gray-200 text-xs font-[500] h-full rounded-md`
          }
        >
          <GiWantedReward className="text-2xl" />
          Rewards
        </NavLink>
      </li>
      <li className="flex-1 h-[60px]">
        <NavLink
          to={"chat"}
          className={({ isActive }) =>
            `${
              isActive
                ? " bg-gradient-to-t from-[#d9ff0088] to-[#3e5a2836] text-[#bfbee6]"
                : undefined
            } flex flex-col items-center justify-center gap-2 text-gray-200 text-xs  font-[500] h-full rounded-md`
          }
        >
          <IoChatbubblesSharp className="text-2xl" />
          Chat
        </NavLink>
      </li>
    </ul>
  );
};

export default NavebareBottom;
