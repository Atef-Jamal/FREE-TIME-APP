import { memo, useEffect, useRef, useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import type { IPrivateMessage } from "../../types";
import { useAppSelector } from "../../context/hooks";
import { useSocketEvents } from "../../hooks/useSocketEvents";
import { debounce } from "../../utilities";
import ChatSidebarUserItem from "./ChatSidebarUserItem";
import ChatSidebarUserItemSkeleton from "./ChatSidebarUserItemSkeleton";
import SearchBar from "../../components/Shared/Modals/SearchModal/SearchBar";
import Spinner from "../../components/Shared/Common/Spinner";
import { useInfiniteConversations } from "../../tanstackQuery/queryFetch";
import { selectActiveSecondUserId, selectUserAuth } from "../../context/appStateSlice";
import { useQuery } from "@tanstack/react-query";

interface IProps {
  toggleSidebar: () => void;
  openSidebar: boolean;
}

const ChatSidbare = memo(({ toggleSidebar, openSidebar }: IProps) => {
  const secondUserId = useAppSelector(selectActiveSecondUserId);
  const userAuth = useAppSelector(selectUserAuth);
  const [redPoint, setRedPoint] = useState(false);
  const conversationsListRef = useRef<HTMLDivElement>(null);

  const { data, error, status, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError } =
    useInfiniteConversations({ userAuth: userAuth === "authenticated" });

  const { data: onlineUsers } = useQuery<string[]>({ queryKey: ["onlines-users-ids"] });

  const allConversations = data?.pages.map((page) => page.conversations).flat();

  const handleNotify = (data: IPrivateMessage) => {
    const isChatWithUserOpen = data.sender._id === secondUserId;
    if (!openSidebar && !isChatWithUserOpen) setRedPoint(true);
  };

  useSocketEvents({
    private_chat_message: handleNotify,
  });

  useEffect(() => {
    if (openSidebar) setRedPoint(false);
  }, [openSidebar]);

  useEffect(() => {
    const container = conversationsListRef.current;
    if (!container) return;
    const onScroll = () => {
      const elementHeight = container.scrollTop + container.clientHeight + 25;
      const elementScrollHeight = container.scrollHeight;
      const reachToTheEnd = elementHeight >= elementScrollHeight;
      if (reachToTheEnd && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
    const debounced = debounce(onScroll);
    container.addEventListener("scroll", debounced);
    return () => container.removeEventListener("scroll", debounced);
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="relative flex h-full flex-col space-y-2 bg-[#131129] px-1 pt-1 sm:px-2 sm:pt-2">
      <span
        onClick={toggleSidebar}
        className="absolute -right-[44px] top-0 flex h-8 w-11 items-center justify-center rounded-sm bg-[#1f1425] sm:h-[48px] 2xl:hidden"
      >
        {redPoint && <span className="absolute right-[2px] top-[2px] h-3 w-3 rounded-full bg-red-600"></span>}
        {openSidebar && <IoCloseSharp className="text-2xl sm:text-3xl" />}
        {!openSidebar && <MdOutlineMenu className="text-2xl sm:text-3xl" />}
      </span>
      <div className="h-8 w-full overflow-hidden">
        <SearchBar placeholder="Find Conversation" onChange={() => {}} />
      </div>
      <div className="flex items-center justify-center gap-x-2 text-xs text-[#c9d1d8] sm:text-sm">
        <span className="flex-1 border-t border-zinc-600"></span>
        {isFetchingNextPage && (
          <div className={"flex h-5 items-center justify-center bg-[#131129]"}>
            <Spinner className="h-4 w-4 border-2 lg:border-[3px]" />
          </div>
        )}
        Peoples
        <span className="flex-1 border-t border-zinc-600"></span>
      </div>
      <div ref={conversationsListRef} className="scrollbar-custom relative flex-1 overflow-y-auto">
        {error && (
          <div className="flex flex-col items-center justify-center">
            <div className="mt-2 text-center text-xs text-gray-400">
              an error occurred during somthing have been item integrated alongside
            </div>
            <button className="mt-1 rounded-sm bg-[#d1363696] px-4 py-1 text-xs text-[#c2cbd6]">
              Try Again
            </button>
          </div>
        )}
        {status === "pending" &&
          [...Array(10).keys()].map((skeleton) => <ChatSidebarUserItemSkeleton key={skeleton} />)}
        {status === "success" &&
          allConversations?.map((conversation) => {
            const isOnLine = Boolean(onlineUsers?.includes(conversation.secondUser._id));
            const chatWithUserOpen = secondUserId === conversation.secondUser._id;
            return (
              <ChatSidebarUserItem
                key={conversation._id}
                conversation={conversation}
                isOnLine={isOnLine}
                chatWithUserOpen={chatWithUserOpen}
              />
            );
          })}

        {isFetchNextPageError && <p className="text-center text-xs text-[#d83d3d]">an Error occurred!</p>}
      </div>
    </div>
  );
});
export default ChatSidbare;
