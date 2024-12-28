import UserImage from "../../Others/UserImage";
import { formateDate } from "../../../utils/common";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { TypeConversation } from "../../../types/privateChatTypes";
import { setActiveConversation } from "../../../context/StateManeger";

interface TypeProps {
  conversation: TypeConversation;
}
const People = ({ conversation }: TypeProps) => {
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const activeConversation = useAppSelector(
    (state) => state.stateManeger.activeConversation
  );
  const dispatch = useAppDispatch();
  let date = "";
  if (conversation.lastMessage) {
    date = formateDate(conversation.lastMessage.createdAt);
  }

  return (
    <div
      onClick={() => {
        dispatch(setActiveConversation(conversation.secondParty._id));
        localStorage.setItem(
          "active-converstaion",
          conversation.secondParty._id
        );
      }}
      className={`relative w-full flex flex-col items-start gap-2 sm:gap-1 rounded-md p-2 sm:p-1 ${
        activeConversation === conversation.secondParty._id && "bg-[#24233b]"
      } `}
    >
      <div className="w-full flex gap-2">
        <div className="w-[50px] h-[35px] sm:w-[30px] sm:h-[25px]">
          <UserImage user={conversation.secondParty} />
        </div>

        <div className="flex flex-col w-full overflow-hidden -mt-1">
          <span className="flex items-center w-[210px] xl:w-[180px] ">
            <span className=" w-[65%] sm:text-sm font-bold text-[#3c72c4] truncate">
              {conversation.secondParty.name}
            </span>
            {onlineUsers.includes(conversation.secondParty._id) && (
              <span className="sm:text-sm  text-[#68e44a] tracking-wider font-[400]">
                onLine
              </span>
            )}
            {!onlineUsers.includes(conversation.secondParty._id) && (
              <span className="sm:text-sm  text-[#676867] tracking-wider font-[400]">
                offline
              </span>
            )}
          </span>
          {(conversation.lastMessage?.createdAt && (
            <span className="sm:text-xs text-sm font-bold text-[#746767] -mt-[2px]">
              {date}
            </span>
          )) || (
            <span className="text-xs xs:text-[9px] font-bold text-gray-400 ml-1">
              -- : --
            </span>
          )}
        </div>
        {conversation.unreadedCount !== 0 ? (
          <span className="transition-all ml-auto w-6 h-5 bg-[#e63636] flex items-center justify-center rounded-full text-xs font-bold ">
            {conversation.unreadedCount}
          </span>
        ) : undefined}
      </div>
      <span className="text-[#b8b4b4] sm:text-xs font-400 tracking-wide overflow-hidden h-6 truncate w-[90%]">
        {conversation.lastMessage ? (
          <>
            {conversation.lastMessage.sender._id === currentUser?._id ? (
              <>
                <span className="font-bold text-[#a3af61]">me : </span>
                {conversation.lastMessage.message}
              </>
            ) : (
              <>
                <span className="font-bold text-[#a3af61]">
                  {conversation.lastMessage.sender.name} :{" "}
                </span>
                {conversation.lastMessage.message}
              </>
            )}
          </>
        ) : (
          `start chating with ${conversation.secondParty.name}`
        )}
      </span>
    </div>
  );
};

export default People;
