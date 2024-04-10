import { useEffect, useState } from "react";
import { BsExclamationOctagonFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { showPopup } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { UserImage, Skeleton } from "../../components";
import { TypeFrame, User } from "../../types";
import { crown } from "../../assets";
import { FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const UsersLiveStats = () => {
  const { currentUser, onlineUsers, socet } = useAppSelector(
    (state) => state.stateManeger
  );
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setError("");
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/users");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("somthing went wrong!");
        dispatch(
          showPopup({
            status: true,
            message: "Failing to Load Live Stats, something went wrong",
            icon: <BsExclamationOctagonFill />,
          })
        );
      }
    };
    fetchAllUsers();
  }, []);

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

  useEffect(() => {
    if (socet) {
      socet.on("user-photo-frame-changed", handleAddPhotoFrame);
      return () => {
        socet.off("user-photo-frame-changed", handleAddPhotoFrame);
      };
    }
  }, [socet]);

  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  useEffect(() => {
    if (socet) {
      socet.on("new-user-register", handleAddUser);
      return () => {
        socet.off("new-user-register", handleAddUser);
      };
    }
  }, [socet]);

  return (
    <div className="w-full flex items-center gap-2 xs:gap-[6px] overflow-y-scroll scrollbar-none p-2">
      {loading && (
        <>
          {[...Array(20).keys()].map((_) => (
            <div
              key={uuidv4()}
              className="flex items-center gap-2 bg-[#222339] px-3 py-2 xs:py-[6px] rounded-sm"
            >
              <Skeleton className="h-7 w-7 xs:h-5 xs:w-5" />
              <div className="flex flex-col gap-[6px] xs:gap-1 h-full">
                <Skeleton className="h-[5px] xs:h-[4px] w-[110px] rounded-sm" />
                <Skeleton className="h-[5px] xs:h-[4px] w-[85px] rounded-sm" />
              </div>
            </div>
          ))}
        </>
      )}
      {error && (
        <div className="text-sm text-gray-400 w-full flex items-center justify-center gap-3 py-1">
          <FaExclamationCircle />
          somthing went wrong
        </div>
      )}
      {!loading &&
        users.length > 0 &&
        users.map((user, index) => {
          const { _id, name, points } = user;
          const isOnline = onlineUsers.includes(_id);
          return (
            <Link
              to={currentUser?._id === _id ? "myprofile" : `user/${_id}`}
              key={_id}
              className="relative bg-[#222339] text-sm h-[45px] min-w-[200px] rounded-sm px-[10px] text-gray-400 flex items-center justify-between sm:h-[30px] sm:px-[5px] sm:min-w-[155px] sm:gap-1 "
            >
              {index === 0 && (
                <img
                  src={crown}
                  alt=""
                  className="absolute -top-[11px] -left-[11px] w-5 h-5 -rotate-45"
                />
              )}
              <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
                <UserImage user={user} />
              </div>
              <div className="flex flex-col">
                <span className="overflow-hidden text-sm font-bold text-gray-200 sm:font-[400] sm:text-xs sm:tracking-wide w-[80px] truncate ">
                  {name}
                </span>

                {isOnline && (
                  <span className="text-xs text-[#5cb945] font-bold">
                    online
                  </span>
                )}
                {!isOnline && (
                  <span className="text-xs text-[#54724c] font-bold">
                    offline
                  </span>
                )}
              </div>
              <span className=" sm:w-8 sm:h-6 w-9 h-8 sm:px-1 sm:text-[9px] flex items-center justify-center rounded-sm bg-[#181616]  text-[#c1f018]">
                {points}
              </span>
            </Link>
          );
        })}
    </div>
  );
};

export default UsersLiveStats;
