import { SetStateAction, Suspense, lazy, useEffect, useState } from "react";
const UserImage = lazy(() => import("../../../components/Others/UserImage"));
import { NavLink } from "react-router-dom";
import { timeAgoFromMongoDBDate } from "../../../context/functions";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { TypeFrame, TypePrivateMessage, User } from "../../../types";
import { setRefetchUnReadedMessagesCount } from "../../../context/StateManeger";
import { makeRequest } from "../../../utils";

const Friend = ({
  userInfo,
  setResized,
}: {
  userInfo: User;
  setResized: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { socet, reFetchThisUserId, onlineUsers } = useAppSelector(
    (state) => state.stateManeger
  );
  const [user, setUser] = useState(userInfo);
  const [recentMessage, setRecentMessage] = useState<TypePrivateMessage | null>(
    null
  );
  const [unReadedCount, setUnReadedCount] = useState<number>(0);

  const dispatch = useAppDispatch();

  const getRecentMessage = async () => {
    try {
      const response = await makeRequest.get(
        `api/conversations/recentmessage/${user._id}`
      );
      setRecentMessage(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUnReadedMessagesCount = async () => {
    try {
      const response = await makeRequest.get(
        `api/conversations/unreadedcount/${user._id}`
      );

      setUnReadedCount(response.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecentMessage();
    getUnReadedMessagesCount();
  }, []);

  useEffect(() => {
    if (reFetchThisUserId === user._id) {
      getRecentMessage();
      getUnReadedMessagesCount();
      dispatch(setRefetchUnReadedMessagesCount(""));
    }
  }, [reFetchThisUserId]);

  const handleMessage = (data: TypePrivateMessage) => {
    if (data.sender._id === user._id) {
      setRecentMessage(data);
      if (location.pathname.includes(user._id) === false) {
        setUnReadedCount((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (socet) {
      socet.on("private-message", handleMessage);
      return () => {
        socet.off("private-message", handleMessage);
      };
    }
  }, [socet]);

  const handleAddPhotoFrame = (data: {
    belongsTo: string;
    frameObj: TypeFrame;
  }) => {
    if (data.belongsTo === user._id) {
      setUser((prevUser) => ({ ...prevUser, activeFrame: data.frameObj }));
    }
  };

  useEffect(() => {
    if (socet) {
      socet.on("user-photo-frame-changed", handleAddPhotoFrame);
      return () => {
        socet.off("user-photo-frame-changed", handleAddPhotoFrame);
      };
    }
  }, [socet]);

  let date = "";
  if (recentMessage) {
    date = timeAgoFromMongoDBDate(recentMessage.createdAt.toString());
  }

  return (
    <NavLink
      onClick={() => {
        if (window.innerWidth < 1131) setResized(true);
      }}
      to={`/privatechat/${user._id}`}
      className={({ isActive }) =>
        `${
          isActive
            ? " bg-[rgb(29,32,61)] border border-gray-700"
            : "bg-[rgba(25,28,53,0.77)]"
        } relative w-full flex flex-col items-start gap-2 sm:gap-1 rounded-lg p-2 sm:p-1`
      }
    >
      <div className="w-full flex gap-2">
        <div className="w-[50px] h-[35px] sm:w-[30px] sm:h-[25px]">
          <Suspense>
            <UserImage user={user} />
          </Suspense>
        </div>

        <div className="flex flex-col w-full overflow-hidden ">
          <span className="flex items-center w-[210px] xl:w-[180px] ">
            <span className=" w-[65%] text-sm font-bold sm:text-xs text-[#afe670] truncate">
              {user.name}
            </span>
            {onlineUsers.includes(userInfo._id) && (
              <span className="text-xs text-[#74a3d8] tracking-wider font-[400]">
                (online)
              </span>
            )}
            {!onlineUsers.includes(userInfo._id) && (
              <span className="text-xs text-[#927f55] tracking-wider font-[400]">
                (offline)
              </span>
            )}
          </span>
          {(recentMessage?.createdAt && (
            <span className="text-xs font-bold text-[#867272]">{date}</span>
          )) || (
            <span className="text-xs font-bold text-gray-400 ml-1">
              -- : --
            </span>
          )}
        </div>
        {unReadedCount &&
        // location.pathname.includes(item._id) === false &&
        unReadedCount !== 0 ? (
          <span className="transition-all ml-auto w-6 h-5 bg-[#e63636] flex items-center justify-center rounded-full text-xs font-bold ">
            {unReadedCount}
          </span>
        ) : undefined}
      </div>
      <span className="text-gray-400 text-xs font-400 tracking-wide overflow-hidden h-6 truncate w-[265px] xl:w-[175px]">
        {(recentMessage && recentMessage.message) || (
          <span className="text-gray-400 text-xs font-400 tracking-wide overflow-hidden h-6 truncate w-[265px] xl:w-[175px] mx-auto">
            Start Chating With ${user.name}
          </span>
        )}
      </span>
    </NavLink>
  );
};

export default Friend;

// const FriendSkeleton = () => (
//   <div className="w-full flex flex-col gap-2 sm:gap-1 p-2 sm:p-1">
//     <div className="flex items-center gap-2">
//       <Skeleton className="w-9 h-9 sm:w-7 sm:h-7 rounded-sm" />
//       <div className="flex flex-col items-center gap-1">
//         <Skeleton className="w-[100px] h-1 rounded-sm" />
//         <Skeleton className="w-[60px] h-1 rounded-sm" />
//       </div>
//     </div>
//     <Skeleton className="w-[90%] h-2 rounded-sm" />
//   </div>
// );
