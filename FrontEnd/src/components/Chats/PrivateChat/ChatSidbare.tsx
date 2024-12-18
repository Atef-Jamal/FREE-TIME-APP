import People from "./People";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useAppSelector } from "../../../context/Hooks";
import SearchBar from "../../Search/SearchBar";
import PeopleSkeleton from "./PeopleSkeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchAllConversations } from "../../../utils";
import { memo } from "react";

interface TypeProps {
  toggleSidbare: () => void;
}

const ChatSidbare = memo(({ toggleSidbare }: TypeProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);
  const isMobile = window.innerWidth <= 867;

  const {
    data: conversations = [],
    status,
    error,
  } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["conversations"],
    queryFn: () => fetchAllConversations({ onlineUsers }),
    staleTime: 60 * 60 * 1000,
  });

  return (
    <div className="relative  h-full flex flex-col items-center gap-2 p-2 sm:p-1 bg-[#131129]">
      <span
        onClick={toggleSidbare}
        className="hidden lg:flex items-center justify-center absolute top-0 -right-9 w-9 h-11 sm:h-9 bg-[#554d4d] rounded-sm"
      >
        <MdKeyboardDoubleArrowRight className="text-2xl" />
      </span>
      <div className="w-full h-12 sm:h-10 overflow-hidden">
        <SearchBar placeholder="search people..." onChange={() => {}} />
      </div>
      <div className="w-full text-[#81bef0] pl-2">Peoples</div>
      <div className="w-full flex flex-1 flex-col items-center gap-2 sm:gap-1 overflow-auto lg:scrollbar-thin  overflow-x-hidden">
        {error && (
          <>
            <div className="mt-2 text-gray-400 font-bold">
              {error.response?.data.error}
            </div>
            <button className="text-sm rounded-md text-[#8fa4bd] px-4 py-1 bg-[#645a5a] font-bold">
              Try Again
            </button>
          </>
        )}
        {status === "pending" &&
          [...Array(isMobile ? 4 : 7).keys()].map((skeleton) => (
            <PeopleSkeleton key={skeleton} />
          ))}
        {status === "success" &&
          conversations.map((conv) => {
            if (conv.secondParty._id === currentUser?._id) return;
            return (
              <div
                onClick={toggleSidbare}
                key={conv.secondParty._id}
                className="w-full"
              >
                <People convInfo={conv} />
              </div>
            );
          })}
      </div>
    </div>
  );
});
export default ChatSidbare;
