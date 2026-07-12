import { memo } from "react";
import type { IConversation } from "../../types";
import { selectCurrentUser, updateActiveChatId } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { cn } from "../../utilities";
// import { formatDistanceToNow } from "date-fns";
import UserImage from "../../components/Shared/Common/UserImage";
import RelativeCountdown from "../../components/Ui/TimeCountDown";

interface IProps {
  conversation: IConversation;
  isOnLine: boolean;
  chatWithUserOpen: boolean;
}

const ChatSidebarUserItem = memo(({ conversation, isOnLine, chatWithUserOpen }: IProps) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  if (!currentUser) return;

  const unreadCounts = conversation.unreadCounts[currentUser._id];

  return (
    <div
      onClick={() => {
        dispatch(updateActiveChatId(conversation.secondUser._id));
        localStorage.setItem("activeChatSecondUserId", conversation.secondUser._id);
      }}
      className={cn(
        "relative w-full space-y-1 rounded-md px-[6px] py-[3px] lg:space-y-2",
        chatWithUserOpen && "bg-[#dcdbff17]",
      )}
    >
      <div className="mb-1 flex items-center gap-2">
        <div className="h-[25px] w-[30px] sm:h-[32px] sm:w-[37px]">
          <UserImage user={conversation.secondUser} />
        </div>

        <div className="flex w-full flex-col overflow-hidden">
          <span className="flex items-center justify-between">
            <span className="truncate text-xs text-[#4077c9] sm:-mt-1 sm:text-sm">
              {conversation.secondUser.name}
            </span>
            {isOnLine && <span className="text-xs tracking-wider text-[#68e44a] sm:text-sm">onLine</span>}
            {!isOnLine && <span className="text-xs tracking-wider text-[#676867] sm:text-sm">offLine</span>}
          </span>
          {(conversation.lastMessage?.createdAt && (
            <RelativeCountdown targetIsoString={conversation.lastMessage.createdAt} />
            // <span className="-mt-[2px] text-[0.7rem] font-bold text-[#746767] sm:text-xs">{date}</span>
          )) || <span className="text-xs text-gray-400 md:font-bold"> --:--</span>}
        </div>
      </div>
      <div className="relative flex items-center justify-between">
        <span className="flex-1 overflow-hidden truncate text-xs tracking-wide text-[#d3c5c5] md:text-sm">
          {conversation.lastMessage?.sender ? (
            <>
              {conversation.lastMessage.sender._id === currentUser._id ? (
                <>
                  <span className="text-[#8eac60]">
                    me <b className="mr-1"> : </b>
                  </span>
                  {conversation.lastMessage.message}
                </>
              ) : (
                <>
                  <span className="text-[#8eac60]">
                    {conversation.secondUser.name} <b className="mr-1"> : </b>
                  </span>
                  {conversation.lastMessage.message}
                </>
              )}
            </>
          ) : (
            <p className="italic tracking-wide text-[#bb8a8ad8]">
              start chating with {conversation.secondUser.name}
            </p>
          )}
        </span>
        {unreadCounts && unreadCounts > 0 ? (
          <span className="absolute -top-3 right-0 h-4 w-4 rounded-full bg-[#da4949] text-center text-xs font-bold transition-all">
            <span> {unreadCounts}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
});

export default ChatSidebarUserItem;
