import { useEffect, useState } from "react";
import { MdLanguage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { crown, egypt } from "../../assets";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { handleApiError, makeRequest } from "../../utils";
import { showPopup } from "../../context/StateManeger";
import { TypeFrame, User } from "../../types";
import { Link } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import UserImage from "../../components/Others/UserImage";
import LiveStatsSkeleton from "./LiveStatsSkeleton";
import { BiErrorAlt } from "react-icons/bi";

const LiveStats = () => {
  const { currentUser, hiddenLiveStats, onlineUsers, socet } = useAppSelector(
    (state) => state.stateManeger
  );
  const [toggleLanguage, setToggleLanguage] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const dispatch = useAppDispatch();

  const languages = [
    { title: "Global", lang: "en" },
    { title: "Egypt", lang: "ar" },
  ];

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setError("");
        setLoading(true);
        const response = await makeRequest.get("api/users");
        setUsers(response.data);
      } catch (error) {
        setError("somthing went wrong!");
        dispatch(
          showPopup({
            status: true,
            message: handleApiError(error),
            icon: <BiErrorAlt />,
          })
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const handleAddPhotoFrame = (data: {
      belongsTo: string;
      frameObj: TypeFrame;
    }) => {
      setUsers((prevUsers) => {
        prevUsers.forEach((user) => {
          if (user._id === data.belongsTo) {
            user.activeFrame = data.frameObj;
          }
        });
        return prevUsers;
      });
    };

    if (socet) {
      socet.on("user-photo-frame-changed", handleAddPhotoFrame);
      return () => {
        socet.off("user-photo-frame-changed", handleAddPhotoFrame);
      };
    }
  }, [socet]);

  useEffect(() => {
    const handleAddUser = (user: User) => {
      setUsers((prev) => [...prev, user]);
    };

    if (socet) {
      socet.on("new-user-register", handleAddUser);
      return () => {
        socet.off("new-user-register", handleAddUser);
      };
    }
  }, [socet]);

  return (
    <div
      className={`${
        hiddenLiveStats ? "hidden" : "flex"
      } items-center w-full sticky top-[75px] sm:top-[55px] z-[2] bg-[#1a1a25] border border-gray-800 `}
    >
      {!!users.length && (
        <img
          src={crown}
          alt=""
          className="absolute -top-[6px] left-[70px] sm:left-[60px] w-7 h-7 sm:w-5 sm:h-5 -rotate-45 z-[1]"
        />
      )}
      <div
        onClick={() => setToggleLanguage(!toggleLanguage)}
        className=" bg-[#222339] mx-2 my-2 sm:my-1 flex items-center gap-2 p-[14px] sm:p-2 rounded-md "
      >
        <MdLanguage />
        <IoIosArrowDown />
      </div>

      {toggleLanguage && (
        <div className="select__languages absolute top-[70px] lg:top-[68px] sm:top-[50px] left-3 rounded-lg w-56 sm:w-40 sm:h-16 bg-[#33334d] flex flex-col py-4 justify-center ">
          {languages.map((item) => (
            <button
              key={item.lang}
              onClick={() => {}}
              className="flex gap-4 items-center rounded-lg mx-2 px-4 py-2 sm:py-1 hover:bg-slate-500"
            >
              {item.title === "Global" ? (
                <MdLanguage />
              ) : (
                <img alt={""} src={egypt} className="w-4 h-4 rounded-full" />
              )}
              <span className="text-[11px] font-[500] text-gray-300">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="w-full flex items-center gap-2 xs:gap-[6px] overflow-y-scroll scrollbar-none">
        {loading && <LiveStatsSkeleton />}

        {error && (
          <div className="text-sm text-gray-400 w-full flex items-center justify-center gap-3 py-1">
            <FaExclamationCircle />
            somthing went wrong
          </div>
        )}

        {!loading &&
          users.length > 0 &&
          users.map((user) => {
            const { _id, name, points } = user;
            const isOnline = onlineUsers.includes(_id);

            return (
              <Link
                key={_id}
                to={currentUser?._id === _id ? "/myprofile" : `/user/${_id}`}
                className="relative bg-[#222339] text-sm h-[45px] min-w-[200px] rounded-sm px-[10px] text-gray-400 flex items-center justify-between sm:h-[30px] sm:px-[5px] sm:min-w-[155px] sm:gap-1 "
              >
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
