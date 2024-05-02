import { useRef, useState } from "react";
import { MdLanguage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import egypt from "../../assets/images/eg.svg";
import { crown } from "../../assets";
import { useAppSelector } from "../../context/Hooks";
import { Link } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import UserImage from "../../components/Others/UserImage";
import LiveStatsSkeleton from "./LiveStatsSkeleton";
import { User } from "../../types/user";
import {
  useCloseMenuOnClickOutSide,
  useFetchAllUsers,
  useListenToEvent,
} from "../../hooks";

const LiveStats = () => {
  const { currentUser, hiddenLiveStats, onlineUsers } = useAppSelector(
    (state) => state.stateManeger
  );
  const { users, setUsers, loading, error } = useFetchAllUsers();
  const [toggleLanguage, setToggleLanguage] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const languages = [
    { title: "Global", lang: "en" },
    { title: "Egypt", lang: "ar" },
  ];

  useListenToEvent<User>({
    eventToListen: "user-updated",
    onUpdate: (updatedUser) => {
      setUsers((prevUsers) => {
        const newArr = prevUsers.map((userItem) => {
          if (userItem._id === updatedUser._id) {
            return updatedUser;
          } else {
            return userItem;
          }
        });
        return newArr;
      });
    },
  });

  useListenToEvent<User>({
    eventToListen: "new-user-joined",
    onUpdate: (newUser) => {
      setUsers((prev) => [...prev, newUser]);
    },
  });

  useCloseMenuOnClickOutSide({
    menuRef: langRef,
    onClose: () => {
      setToggleLanguage(false);
    },
  });

  return (
    <div
      className={`${
        hiddenLiveStats ? "hidden" : "flex"
      } items-center w-full sticky top-[75px] sm:top-[55px] z-[2] bg-[#1a1a25] border border-gray-800 `}
    >
      <div
        onClick={() => setToggleLanguage(!toggleLanguage)}
        ref={langRef}
        className=" bg-[#222339] ml-2 sm:ml-1 flex items-center gap-2 p-[14px] sm:p-2 rounded-md my-1 relative"
      >
        <MdLanguage />
        <IoIosArrowDown />
        {toggleLanguage && (
          <div className="select__languages absolute top-[60px] lg:top-[64px] sm:top-[45px] left-3 sm:left-1 rounded-md w-56 sm:w-40  bg-[#33334d] flex flex-col justify-center py-1">
            {languages.map((item) => (
              <button
                key={item.lang}
                onClick={(e) => e.stopPropagation()}
                className="flex gap-4 items-center hover:bg-slate-500 py-1 pl-2"
              >
                {item.title === "Global" ? (
                  <MdLanguage className="xs:text-sm text-xl" />
                ) : (
                  <img
                    alt={""}
                    src={egypt}
                    className="xs:w-4 xs:h-4 w-5 h-5 rounded-full"
                  />
                )}
                <span className="xs:text-xs font-[500] text-gray-300">
                  {item.title}
                </span>
                <span className="text-xs font-[500] text-gray-300">
                  ( {item.lang.toUpperCase()} )
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full flex items-center gap-2 xs:gap-[6px] overflow-y-scroll scrollbar-none pl-2  py-2 sm:py-1">
        {loading && <LiveStatsSkeleton />}

        {error && (
          <div className="text-sm text-gray-400 w-full flex items-center justify-center gap-3 py-1">
            <FaExclamationCircle />
            somthing went wrong
          </div>
        )}

        {users.map((user, index) => {
          const { _id, name, points } = user;
          const isOnline = onlineUsers.includes(_id);

          return (
            <Link
              key={_id}
              to={currentUser?._id === _id ? "/myprofile" : `/user/${_id}`}
              className="relative bg-[#222339] text-sm h-[45px] min-w-[200px] rounded-sm px-[10px] text-gray-400 flex items-center justify-between sm:h-[30px] sm:px-[5px] sm:min-w-[155px] sm:gap-1 "
            >
              {index === 0 && (
                <span className="absolute -top-2 -left-2 w-5 h-5 -rotate-45">
                  <img src={crown} alt="" className="" />
                </span>
              )}
              <div className="w-[35px] h-[30px] sm:w-[25px] sm:h-[20px]">
                <UserImage user={user} />
              </div>
              <div className="flex flex-col">
                <span className="overflow-hidden  font-boldsm:font-[400] text-xs sm:text-[9px] sm:tracking-wide w-[80px] truncate sm:-mb-1 text-[#dddbdb] tracking-wider">
                  {name}
                </span>

                {isOnline && (
                  <span className="text-xs text-[#5cb945] font-bold tracking-wide sm:text-[9px]">
                    online
                  </span>
                )}
                {!isOnline && (
                  <span className="text-xs text-[#54724c] font-bold  tracking-wide sm:text-[9px]">
                    offline
                  </span>
                )}
              </div>
              <span className=" sm:w-8 sm:h-6 w-9 h-8 sm:px-1 sm:text-[9px] flex items-center justify-center rounded-md bg-[#181616]  text-[#c1f018]">
                {points}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LiveStats;
