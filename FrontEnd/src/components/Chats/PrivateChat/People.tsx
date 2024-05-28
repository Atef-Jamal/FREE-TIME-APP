import UserImage from "../../Others/UserImage";
import { formateDate } from "../../../utils/common";
import { useAppSelector } from "../../../context/Hooks";
import { SetStateAction } from "react";
import { TypeConversation } from "../../../types/privateChatTypes";

interface TypeProps {
  convInfo: TypeConversation;
  activeConversation: string | null;
  setActiveConversation: React.Dispatch<SetStateAction<string | null>>;
}
const People = ({
  convInfo,
  activeConversation,
  setActiveConversation,
}: TypeProps) => {
  const { onlineUsers } = useAppSelector((state) => state.stateManeger);

  let date = "";
  if (convInfo.lastMessage) {
    date = formateDate(convInfo.lastMessage.createdAt);
  }

  return (
    <div
      onClick={() => {
        setActiveConversation(convInfo.secondParty._id);
      }}
      className={`relative w-full flex flex-col items-start gap-2 sm:gap-1 rounded-md p-2 sm:p-1 ${
        activeConversation === convInfo.secondParty._id && "bg-[#1c1b2e]"
      } `}
    >
      <div className="w-full flex gap-2">
        <div className="w-[50px] h-[35px] sm:w-[30px] sm:h-[25px]">
          <UserImage user={convInfo.secondParty} />
        </div>

        <div className="flex flex-col w-full overflow-hidden ">
          <span className="flex items-center w-[210px] xl:w-[180px] ">
            <span className=" w-[65%] text-sm sm:text-xs text-[#afe670] truncate">
              {convInfo.secondParty.name}
            </span>
            {onlineUsers.includes(convInfo.secondParty._id) && (
              <span className="text-xs text-[#74a3d8] tracking-wider font-[400]">
                (online)
              </span>
            )}
            {!onlineUsers.includes(convInfo.secondParty._id) && (
              <span className="text-xs text-[#927f55] tracking-wider font-[400]">
                (offline)
              </span>
            )}
          </span>
          {(convInfo.lastMessage?.createdAt && (
            <span className="text-xs xs:text-[9px] font-bold text-[#947e7ebb] -mt-[2px]">
              {date}
            </span>
          )) || (
            <span className="text-xs font-bold text-gray-400 ml-1">
              -- : --
            </span>
          )}
        </div>
        {convInfo.unreadedCount !== 0 ? (
          <span className="transition-all ml-auto w-6 h-5 bg-[#e63636] flex items-center justify-center rounded-full text-xs font-bold ">
            {convInfo.unreadedCount}
          </span>
        ) : undefined}
      </div>
      <span className="text-gray-400 text-xs font-400 tracking-wide overflow-hidden h-6 truncate w-[265px] xl:w-[175px]">
        {(convInfo.lastMessage && convInfo.lastMessage.message) || (
          <span className="text-gray-400 text-xs font-400 tracking-wide overflow-hidden h-6 truncate w-[265px] xl:w-[175px] mx-auto">
            Start Chating With ${convInfo.secondParty.name}
          </span>
        )}
      </span>
    </div>
  );
};

export default People;
