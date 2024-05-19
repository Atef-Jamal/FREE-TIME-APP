import { useEffect, useState } from "react";
import UserImage from "../../Others/UserImage";
import { NavLink } from "react-router-dom";
import { formateDate } from "../../../utils/common";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { setRefetchUnReadedMessagesCount } from "../../../context/StateManeger";
import { makeRequest } from "../../../utils";
import { TypePrivateMessage } from "../../../types/privateChatTypes";
import { User } from "../../../types/userTypes";
import { useListenToEvent } from "../../../hooks";

const People = ({ userInfo }: { userInfo: User }) => {
  const { reFetchThisUserId, onlineUsers } = useAppSelector(
    (state) => state.stateManeger
  );
  const [user, setUser] = useState(userInfo);
  const [recentMessage, setRecentMessage] = useState<TypePrivateMessage | null>(
    null
  );
  const [unReadedCount, setUnReadedCount] = useState<number>(0);
  const dispatch = useAppDispatch();

  useListenToEvent<TypePrivateMessage>({
    eventToListen: "private-message",
    onUpdate: (data) => {
      if (data.sender._id === user._id) {
        setRecentMessage(data);
        if (location.pathname.includes(user._id) === false) {
          setUnReadedCount((prev) => prev + 1);
        }
      }
    },
  });

  useListenToEvent<User>({
    eventToListen: "user-updated",
    onUpdate: (updatedUser) => {
      if (updatedUser._id === user._id) {
        setUser(updatedUser);
      }
    },
  });

  const getRecentMessage = async () => {
    try {
      const response = await makeRequest.get(
        `api/conversations/recentmessage/${user._id}`
      );
      setRecentMessage(response.data);
    } catch (error) {}
  };

  const getUnReadedMessagesCount = async () => {
    try {
      const response = await makeRequest.get(
        `api/conversations/unreadedcount/${user._id}`
      );

      setUnReadedCount(response.data.count);
    } catch (error) {}
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

  let date = "";
  if (recentMessage) {
    date = formateDate(recentMessage.createdAt.toString());
  }

  return (
    <NavLink
      onClick={() => {}}
      to={`/privatechat/${user._id}`}
      className={({ isActive }) =>
        `${
          isActive
            ? " bg-[rgb(33,37,70)] border border-gray-700"
            : "bg-[rgba(25,28,53,0.77)]"
        } relative w-full flex flex-col items-start gap-2 sm:gap-1 rounded-lg p-2 sm:p-1`
      }
    >
      <div className="w-full flex gap-2">
        <div className="w-[50px] h-[35px] sm:w-[30px] sm:h-[25px]">
          <UserImage user={user} />
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

export default People;
