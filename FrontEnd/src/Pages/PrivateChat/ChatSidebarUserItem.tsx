import { memo } from "react";
import { IConversation } from "../../types/privateChatTypes";
import { setActiveConversation } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { cn, formateDate } from "../../utils/common";
import UserImage from "../../components/Shared/Common/UserImage";

interface IProps {
  conversation: IConversation;
  isOnLine: boolean;
  chatWithUserOpen: boolean;
}

const ChatSidebarUserItem = memo(({ conversation, isOnLine, chatWithUserOpen }: IProps) => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
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
      className={cn("relative w-full rounded-md p-1", chatWithUserOpen && "bg-[#dcdbff17]")}
    >
      <div className="mb-1 flex items-center gap-2">
        <div className="h-[25px] w-[30px] sm:h-[32px] sm:w-[37px]">
          <UserImage user={conversation.secondParty} />
        </div>

        <div className="flex w-full flex-col overflow-hidden">
          <span className="flex items-center justify-between">
            <span className="truncate text-xs text-[#4077c9] sm:-mt-1 sm:text-sm">
              {conversation.secondParty.name}
            </span>
            {isOnLine && (
              <span className="text-xs font-bold tracking-wider text-[#68e44a] sm:text-sm">onLine</span>
            )}
            {!isOnLine && (
              <span className="text-xs font-bold tracking-wider text-[#676867] sm:text-sm">offLine</span>
            )}
          </span>
          {(conversation.lastMessage?.createdAt && (
            <span className="-mt-[2px] text-[0.7rem] font-bold text-[#746767] sm:text-xs">{date}</span>
          )) || <span className="text-xs font-bold text-gray-400"> --:--</span>}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="h-6 flex-1 overflow-hidden truncate text-xs tracking-wide text-[#d3c5c5] md:text-sm">
          {conversation.lastMessage ? (
            <>
              {conversation.lastMessage.sender._id === currentUser?._id ? (
                <>
                  <span className="font-bold text-[#8eac60]">
                    me <b className="mr-1"> : </b>
                  </span>
                  {conversation.lastMessage.message}
                </>
              ) : (
                <>
                  <span className="font-bold text-[#8eac60]">
                    {conversation.lastMessage.sender.name} <b className="mr-1"> : </b>
                  </span>
                  {conversation.lastMessage.message}
                </>
              )}
            </>
          ) : (
            <p className="italic tracking-wide text-[#bb8a8a]">
              start chating with {conversation.secondParty.name}
            </p>
          )}
        </span>
        {conversation.unreadedCount > 0 ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e63636] text-xs font-bold transition-all">
            {conversation.unreadedCount}
          </span>
        ) : undefined}
      </div>
    </div>
  );
});

export default ChatSidebarUserItem;
