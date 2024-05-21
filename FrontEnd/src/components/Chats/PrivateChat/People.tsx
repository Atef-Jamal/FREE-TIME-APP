import UserImage from "../../Others/UserImage";
import { NavLink } from "react-router-dom";
import { formateDate } from "../../../utils/common";
import { useAppSelector } from "../../../context/Hooks";
import { ExtendedUser } from "./ChatSidbare";

const People = ({ userInfo }: { userInfo: ExtendedUser }) => {
  const { onlineUsers } = useAppSelector((state) => state.stateManeger);

  let date = "";
  if (userInfo.lastMessage) {
    date = formateDate(userInfo.lastMessage.createdAt.toString());
  }
  console.log(userInfo.unreadedCount);
  return (
    <NavLink
      onClick={() => {}}
      to={`/privatechat/${userInfo._id}`}
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
          <UserImage user={userInfo} />
        </div>

        <div className="flex flex-col w-full overflow-hidden ">
          <span className="flex items-center w-[210px] xl:w-[180px] ">
            <span className=" w-[65%] text-sm font-bold sm:text-xs text-[#afe670] truncate">
              {userInfo.name}
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
          {(userInfo.lastMessage?.createdAt && (
            <span className="text-xs font-bold text-[#867272]">{date}</span>
          )) || (
            <span className="text-xs font-bold text-gray-400 ml-1">
              -- : --
            </span>
          )}
        </div>
        {userInfo.unreadedCount !== 0 ? (
          <span className="transition-all ml-auto w-6 h-5 bg-[#e63636] flex items-center justify-center rounded-full text-xs font-bold ">
            {userInfo.unreadedCount}
          </span>
        ) : undefined}
      </div>
      <span className="text-gray-400 text-xs font-400 tracking-wide overflow-hidden h-6 truncate w-[265px] xl:w-[175px]">
        {(userInfo.lastMessage && userInfo.lastMessage.message) || (
          <span className="text-gray-400 text-xs font-400 tracking-wide overflow-hidden h-6 truncate w-[265px] xl:w-[175px] mx-auto">
            Start Chating With ${userInfo.name}
          </span>
        )}
      </span>
    </NavLink>
  );
};

export default People;
