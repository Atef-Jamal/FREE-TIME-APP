import { useEffect, useState } from "react";
import { MdLanguage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { crown, verifiedImage } from "../../assets";
import { useAppSelector } from "../../context/Hooks";
import { Link } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import UserImage from "../others/UserImage";
import LiveStatsSkeleton from "./LiveStatsSkeleton";
import { User } from "../../types/userTypes";
import { useFetchAllUsers, useListenToSocketEvents } from "../../hooks";
import LangMenu from "./LangMenu";
import { useTranslation } from "react-i18next";

const LiveStats = () => {
  const { currentUser, onlineUsers } = useAppSelector(
    (state) => state.stateManeger
  );
  const { users, setUsers, loading, error } = useFetchAllUsers();
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [userHieghestPoints, setUserHieghestPoints] = useState<string | null>(
    null
  );
  const [openLangMenu, setOpenLangMenu] = useState(false);
  const { i18n } = useTranslation();

  let example = false;
  if (example) {
    console.log(i18n);
  }

  const sorted = [...users].sort((a, b) => {
    const aIsOnline = onlineUsers.includes(a._id);
    const bIsOnline = onlineUsers.includes(b._id);

    if (aIsOnline && !bIsOnline) {
      return -1;
    }
    if (!aIsOnline && bIsOnline) {
      return 1;
    } else {
      if (a.points === b.points) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return b.points - a.points;
    }
  });

  const handleAddUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handlUpdateUser = (updatedUser: User) => {
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
  };

  useListenToSocketEvents({
    eventsToListen: ["new-user-joined", "user-updated"],
    handlers: [handleAddUser, handlUpdateUser],
  });

  useEffect(() => {
    if (users.length > 0) {
      setSortedUsers(sorted);
      const hieghestPoints = [...users].sort((a, b) => {
        return b.points - a.points;
      })[0];
      setUserHieghestPoints(hieghestPoints._id);
    }
  }, [users, onlineUsers]);

  return (
    <div className={`flex w-full`}>
      <div
        onClick={() => setOpenLangMenu(!openLangMenu)}
        className=" bg-[#222339] ml-2 sm:ml-1 flex items-center gap-2 p-[14px] sm:p-2 rounded-md my-1 relative"
      >
        <MdLanguage />
        <IoIosArrowDown />
        {openLangMenu && <LangMenu setOpenLangMenu={setOpenLangMenu} />}
      </div>
      <div className=" flex items-center gap-2 xs:gap-[6px] overflow-scroll scrollbar-none sm:scrollbar-thin pl-2  py-2 sm:py-1 w-full ">
        {loading && <LiveStatsSkeleton />}

        {error && (
          <div className="text-sm text-gray-400 w-full flex items-center justify-center gap-3 py-1">
            <FaExclamationCircle />
            somthing went wrong
          </div>
        )}

        {!error &&
          sortedUsers.map((user) => {
            const { _id, name, points, emailVerified } = user;
            const isOnline = onlineUsers.includes(_id);

            return (
              <Link
                key={_id}
                to={currentUser?._id === _id ? "/myprofile" : `/user/${_id}`}
                className="relative bg-[#222339] text-sm h-[45px] min-w-[200px] rounded-sm px-[10px] text-gray-400 flex items-center justify-between sm:h-[30px] sm:px-[5px] sm:min-w-[155px] sm:gap-1 "
              >
                {userHieghestPoints === _id && (
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
                  <div className="flex items-center gap-8">
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
                    {emailVerified && (
                      <img
                        src={verifiedImage}
                        alt=""
                        className="w-4 h-4 sm:w-3 sm:h-3 object-contain -mt-[2px]"
                      />
                    )}
                  </div>
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
