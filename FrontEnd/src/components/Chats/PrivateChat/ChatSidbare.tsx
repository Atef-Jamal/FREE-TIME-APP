import People from "./People";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { SetStateAction, useEffect, useState } from "react";
import { useAppSelector } from "../../../context/Hooks";
import Empty from "../../Others/Empty";
import SearchBar from "../../Search/SearchBar";
import { TypeConversation } from "../../../types/privateChatTypes";
import PeopleSkeleton from "./PeopleSkeleton";

interface TypeProps {
  toggleSidbare: () => void;
  conversations: TypeConversation[];
  activeConversation: string | null;
  setActiveConversation: React.Dispatch<SetStateAction<string | null>>;
  loading: boolean;
  error: string | null;
  setRefetch: React.Dispatch<SetStateAction<boolean>>;
}

const ChatSidbare = ({
  toggleSidbare,
  conversations,
  activeConversation,
  loading,
  error,
  setRefetch,
  setActiveConversation,
}: TypeProps) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [filteredUsers, setFilteredUsers] = useState<TypeConversation[]>([]);
  const [filterVlaue, setFilterValue] = useState<string>("");
  const [emptyResults, setEmptyResults] = useState<boolean>(false);

  useEffect(() => {
    setEmptyResults(false);
    if (filterVlaue) {
      const matchedUsers = conversations.filter((conv) =>
        conv.secondParty.name
          .toLocaleLowerCase()
          .includes(filterVlaue.toLocaleLowerCase())
      );
      if (matchedUsers.length > 0) {
        setFilteredUsers(matchedUsers);
      } else {
        setEmptyResults(true);
      }
    } else if (filterVlaue === "") {
      setFilteredUsers(conversations);
    }
  }, [filterVlaue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const isMobile = window.innerWidth <= 867;

  return (
    <div className="relative  h-full flex flex-col items-center gap-2 p-2 sm:p-1 bg-[#131129]">
      <span
        onClick={toggleSidbare}
        className="hidden lg:flex items-center justify-center absolute top-0 -right-9 w-9 h-11 sm:h-9 bg-[#423e3e] rounded-sm"
      >
        <MdKeyboardDoubleArrowRight className="text-2xl" />
      </span>
      <div className="w-full h-12 sm:h-10 overflow-hidden">
        <SearchBar placeholder="search people..." onChange={handleChange} />
      </div>
      <div className="w-full text-[#81bef0] pl-2">Peoples</div>
      <div className="w-full flex flex-1 flex-col items-center gap-2 sm:gap-1 overflow-auto lg:scrollbar-thin  overflow-x-hidden">
        {error && (
          <>
            <div className="mt-2 text-gray-400 font-bold">{error}</div>
            <button
              className="text-sm rounded-md text-[#8fa4bd] px-4 py-1 bg-[#645a5a] font-bold"
              onClick={() => setRefetch((prev) => !prev)}
            >
              Try Again
            </button>
          </>
        )}
        {loading &&
          [...Array(isMobile ? 6 : 12).keys()].map((skeleton) => (
            <PeopleSkeleton key={skeleton} />
          ))}
        {!loading &&
          !emptyResults &&
          filteredUsers.length === 0 &&
          conversations.length > 0 &&
          conversations.map((conv) => {
            if (conv.secondParty._id === currentUser?._id) return;
            return (
              <div
                onClick={toggleSidbare}
                key={conv.secondParty._id}
                className="w-full"
              >
                <People
                  convInfo={conv}
                  activeConversation={activeConversation}
                  setActiveConversation={setActiveConversation}
                />
              </div>
            );
          })}

        {!loading &&
          !emptyResults &&
          filteredUsers.length > 0 &&
          filteredUsers?.map((conv) => {
            if (conv.secondParty._id === currentUser?._id) return;
            return (
              <div
                onClick={toggleSidbare}
                key={conv.secondParty._id}
                className="w-full"
              >
                <People
                  convInfo={conv}
                  activeConversation={activeConversation}
                  setActiveConversation={setActiveConversation}
                />
              </div>
            );
          })}
        {emptyResults && <Empty emptyText="Empty" imgWidthHeight="w-8 h-8" />}
      </div>
    </div>
  );
};
export default ChatSidbare;
