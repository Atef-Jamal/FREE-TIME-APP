import People from "./People";
import { useAppSelector } from "../../../context/Hooks";
import SearchBar from "../../Search/SearchBar";
import PeopleSkeleton from "./PeopleSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllConversations } from "../../../utils";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useListenToSocketEvents } from "../../../hooks";
import { IPrivateMessage } from "../../../types/privateChatTypes";
import { debounce } from "../../../utils/common";
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import Spinner from "../../Others/Spinner";

interface IProps {
  toggleSidbare: () => void;
  openSidbare: boolean;
}

const ChatSidbare = memo(({ toggleSidbare, openSidbare }: IProps) => {
  const activeConversation = useAppSelector((state) => state.stateManeger.activeConversation);
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);

  const [redPoint, setRedPoint] = useState(false);
  const conversationsListRef = useRef<HTMLDivElement>(null);
  const timeOutRef = useRef(null);

  const { data, error, status, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError } =
    useInfiniteQuery({
      queryKey: ["conversations"],
      queryFn: ({ pageParam }) => fetchAllConversations({ pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, pageParam) => (lastPage.hasMore ? pageParam + 1 : undefined),
      staleTime: 60 * 60 * 1000,
    });

  const conversations = useMemo(() => {
    return data?.pages.map((page) => page.conversations).flat();
  }, [data?.pages]);

  const handleNotify = (data: IPrivateMessage) => {
    const isChatWithUserOpen = data.sender._id === activeConversation;
    if (!openSidbare && !isChatWithUserOpen) setRedPoint(true);
  };

  useListenToSocketEvents({
    eventsToListen: ["private-message"],
    handlers: [handleNotify],
  });

  useEffect(() => {
    if (openSidbare) setRedPoint(false);
  }, [openSidbare]);

  useEffect(() => {
    const container = conversationsListRef.current;
    if (!container) return;
    const onScroll = () => {
      const reachToTheEnd = container.scrollTop + container.clientHeight >= container.scrollHeight;

      if (reachToTheEnd && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
    const debounced = debounce(onScroll, 250, timeOutRef);
    container.addEventListener("scroll", debounced);
    return () => container.removeEventListener("scroll", debounced);
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="relative flex h-full flex-col space-y-2 bg-[#131129] px-1 pt-1 sm:px-2 sm:pt-2">
      <span
        onClick={toggleSidbare}
        className="absolute -right-[45px] top-0 flex h-8 w-11 items-center justify-center rounded-sm bg-[#1f1425] sm:h-[48px] sm:w-11 2xl:hidden"
      >
        {redPoint && <span className="absolute right-[2px] top-[2px] h-3 w-3 rounded-full bg-red-600"></span>}
        {!openSidbare && <IoCloseSharp className="text-2xl sm:text-3xl" />}
        {openSidbare && <MdOutlineMenu className="text-2xl sm:text-3xl" />}
      </span>
      <div className="h-8 w-full overflow-hidden">
        <SearchBar placeholder="Find Conversation" onChange={() => {}} />
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-[#c9d1d8] sm:text-sm">
        <span className="flex-1 border-t border-zinc-600"></span>Peoples
        <span className="flex-1 border-t border-zinc-600"></span>
      </div>
      <div ref={conversationsListRef} className="scrollbar-custom relative flex-1 overflow-y-scroll">
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
        {status === "pending" && [...Array(10).keys()].map((skeleton) => <PeopleSkeleton key={skeleton} />)}
        {status === "success" &&
          conversations?.map((conversation) => {
            const isOnLine = onlineUsers.includes(conversation.secondParty._id);
            const chatWithUserOpen = activeConversation === conversation.secondParty._id;
            return (
              <People
                key={conversation.secondParty._id}
                conversation={conversation}
                isOnLine={isOnLine}
                chatWithUserOpen={chatWithUserOpen}
              />
            );
          })}

        {isFetchNextPageError && <p className="text-center text-xs text-[#d83d3d]">an Error occurred!</p>}
        {isFetchingNextPage && (
          <div className={"sticky bottom-0 flex h-9 items-center justify-center bg-[#131129]"}>
            <Spinner className="h-6 w-6 border-[3px]" />
          </div>
        )}
      </div>
    </div>
  );
});
export default ChatSidbare;
