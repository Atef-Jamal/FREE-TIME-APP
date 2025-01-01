import UserImage from "../../Others/UserImage";
import { formateDate } from "../../../utils/common";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { TypeConversation } from "../../../types/privateChatTypes";
import { setActiveConversation } from "../../../context/StateManeger";
import { memo } from "react";

interface TypeProps {
  conversation: TypeConversation;
  isOnLine: boolean;
}
const People = memo(({ conversation, isOnLine }: TypeProps) => {
  // const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const dispatch = useAppDispatch();

  let date = "";
  if (conversation.lastMessage) {
    date = formateDate(conversation.lastMessage.createdAt);
  }

  return (
    <div
      onClick={() => {
        dispatch(setActiveConversation(conversation.secondParty._id));
        localStorage.setItem("active-converstaion", conversation.secondParty._id);
      }}
      className={"relative w-full flex flex-col items-start gap-2 sm:gap-1 rounded-md p-2 sm:p-1"}
    >
      <div className="w-full flex gap-2">
        <div className="w-[50px] h-[35px] sm:w-[30px] sm:h-[25px]">
          <UserImage user={conversation.secondParty} />
        </div>

        <div className="flex flex-col w-full overflow-hidden -mt-1">
          <span className="flex items-center w-[210px] xl:w-[180px] ">
            <span className=" w-[65%] sm:text-sm xs:text-xs font-bold text-[#3c72c4] truncate">
              {conversation.secondParty.name}
            </span>
            {isOnLine && (
              <span className="sm:text-sm xs:text-xs text-[#68e44a] tracking-wider font-[400]">onLine</span>
            )}
            {!isOnLine && (
              <span className="sm:text-sm xs:text-xs text-[#676867] tracking-wider font-[400]">offLine</span>
            )}
          </span>
          {(conversation.lastMessage?.createdAt && (
            <span className="xs:text-xs text-sm font-bold text-[#746767] -mt-[2px]">{date}</span>
          )) || <span className="text-xs xs:text-[9px] font-bold text-gray-400 ml-1">-- : --</span>}
        </div>
        {conversation.unreadedCount !== 0 ? (
          <span className="transition-all ml-auto w-6 h-5 bg-[#e63636] flex items-center justify-center rounded-full text-xs font-bold ">
            {conversation.unreadedCount}
          </span>
        ) : undefined}
      </div>
      <span className="text-[#d3c5c5] sm:text-xs font-400 tracking-wide overflow-hidden h-6 truncate w-[90%]">
        {conversation.lastMessage ? (
          <>
            {conversation.lastMessage.sender._id === currentUser?._id ? (
              <>
                <span className="font-bold text-[#8eac60]">
                  me <b> : </b>
                </span>
                {conversation.lastMessage.message}
              </>
            ) : (
              <>
                <span className="font-bold text-[#8eac60]">
                  {conversation.lastMessage.sender.name} <b> : </b>
                </span>
                {conversation.lastMessage.message}
              </>
            )}
          </>
        ) : (
          <p className="text-[#bb8a8a] sm:text-xs font-400 tracking-wide italic">
            start chating with {conversation.secondParty.name}
          </p>
        )}
      </span>
    </div>
  );
});

export default People;
