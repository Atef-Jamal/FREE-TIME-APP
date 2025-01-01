import People from "./People";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useAppSelector } from "../../../context/Hooks";
import SearchBar from "../../Search/SearchBar";
import PeopleSkeleton from "./PeopleSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllConversations } from "../../../utils";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useListenToSocketEvents } from "../../../hooks";
import { TypePrivateMessage } from "../../../types/privateChatTypes";
import { debounce } from "../../../utils/common";
import Spinner from "../../Others/Spinner";

interface TypeProps {
  toggleSidbare: () => void;
  openSidbare: boolean;
}

const ChatSidbare = memo(({ toggleSidbare, openSidbare }: TypeProps) => {
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

  const handleNotify = (data: TypePrivateMessage) => {
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
    <div className="relative  h-full flex flex-col items-center gap-2 p-2 sm:p-1 bg-[#131129]">
      <span
        onClick={toggleSidbare}
        className="hidden lg:flex items-center justify-center absolute top-0 -right-9 w-9 h-11 sm:h-8 bg-[#000000] rounded-sm"
      >
        {redPoint && <span className="absolute top-[2px] right-[2px] w-3 h-3 bg-red-600 rounded-full"></span>}
        {!openSidbare && <MdKeyboardDoubleArrowRight className="text-2xl" />}
        {openSidbare && <MdKeyboardDoubleArrowLeft className="text-2xl" />}
      </span>
      <div className="w-full h-12 sm:h-10 overflow-hidden">
        <SearchBar placeholder="search people..." onChange={() => {}} />
      </div>
      <div className="w-full text-[#81bef0] pl-2">Peoples</div>
      <div
        ref={conversationsListRef}
        className="w-full flex flex-1 flex-col items-center gap-2 sm:gap-1 overflow-auto lg:scrollbar-thin  overflow-x-hidden"
      >
        {error && (
          <>
            <div className="mt-2 text-gray-400 font-bold">{error.response?.data.error}</div>
            <button className="text-sm rounded-md text-[#8fa4bd] px-4 py-1 bg-[#645a5a] font-bold">
              Try Again
            </button>
          </>
        )}
        {status === "pending" && [...Array(15).keys()].map((skeleton) => <PeopleSkeleton key={skeleton} />)}
        {status === "success" &&
          conversations?.map((conversation) => {
            const isOnLine = onlineUsers.includes(conversation.secondParty._id);
            return (
              <div
                onClick={toggleSidbare}
                key={conversation.secondParty._id}
                className={`w-full ${activeConversation === conversation.secondParty._id && "bg-[#24233b]"}`}
              >
                <People conversation={conversation} isOnLine={isOnLine} />
              </div>
            );
          })}

        {isFetchNextPageError && <p className="text-sm text-[#dd2a2a]">an Error occurred!</p>}
        <div
          className={`${
            isFetchingNextPage ? "visible" : "invisible"
          } w-full bg-[#131129] flex items-center justify-center`}
        >
          <Spinner className="w-7 h-7 sm:w-5 sm:h-5 border-4 sm:border-[3px]" />
        </div>
      </div>
    </div>
  );
});
export default ChatSidbare;
