import People from "./People";
import Spinner from "../../Others/Spinner";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../context/Hooks";
import { User } from "../../../types/userTypes";
import { useListenToSocketEvent } from "../../../hooks";
import Empty from "../../Others/Empty";
import SearchBar from "../../Search/SearchBar";
import { makeRequest } from "../../../utils";
import { TypePrivateMessage } from "../../../types/privateChatTypes";

export interface ExtendedUser extends User {
  lastMessage: TypePrivateMessage | null;
  unreadedCount: number;
}

const ChatSidbare = ({ toggleSidbare }: { toggleSidbare: () => void }) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [filterVlaue, setFilterValue] = useState<string>("");
  const [emptyResults, setEmptyResults] = useState<boolean>(false);

  const error = null;
  const loading = false;

  useListenToSocketEvent<User>({
    eventToListen: "new-user-joined",
    onUpdate: (newUser) => {
      setUsers((prev) => [
        ...prev,
        { ...newUser, lastMessage: null, unreadedCount: 0 },
      ]);
    },
  });

  useListenToSocketEvent<User>({
    eventToListen: "user-updated",
    onUpdate: (updatedUser) => {
      setUsers((prev) => {
        const newArry = prev.map((usr) => {
          if (usr._id === updatedUser._id) {
            return {
              ...updatedUser,
              lastMessage: usr.lastMessage,
              unreadedCount: usr.unreadedCount,
            };
          } else {
            return usr;
          }
        });
        return newArry;
      });
    },
  });

  useEffect(() => {
    setEmptyResults(false);
    if (filterVlaue) {
      const matchedUsers = users.filter((user) =>
        user.name.toLocaleLowerCase().includes(filterVlaue.toLocaleLowerCase())
      );
      if (matchedUsers.length > 0) {
        setFilteredUsers(matchedUsers);
      } else {
        setEmptyResults(true);
      }
    } else if (filterVlaue === "") {
      setFilteredUsers(users);
    }
  }, [filterVlaue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  useListenToSocketEvent<TypePrivateMessage>({
    eventToListen: "private-message",
    onUpdate: (data) => {
      setUsers((prev) => {
        const newArry = prev.map((user) => {
          if (data.sender._id === user._id) {
            user.lastMessage = data;
            const isChatWithUserOpen = location.pathname.includes(user._id);
            return {
              ...user,
              lastMessage: data,
              unreadedCount: isChatWithUserOpen
                ? user.unreadedCount
                : user.unreadedCount + 1,
            };
          } else {
            return user;
          }
        });
        return newArry;
      });
    },
  });

  useEffect(() => {
    const fetchAllConversations = async () => {
      try {
        const response = await makeRequest.get(
          "api/conversations/all-conversations/allusers"
        );
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllConversations();
  }, []);

  return (
    <div className="relative  h-full flex flex-col items-center gap-2 p-2 sm:p-1 bg-[#131129]">
      <span
        onClick={toggleSidbare}
        className="hidden lg:flex items-center justify-center  absolute top-0 -right-9 w-9 h-9 bg-[#5353a8] rounded-sm"
      >
        <MdKeyboardDoubleArrowRight className="text-2xl" />
      </span>
      <div className="w-full h-12 sm:h-10 mt-3 rounded-md overflow-hidden">
        <SearchBar placeholder="search people..." onChange={handleChange} />
      </div>
      <div className="w-full text-[#81bef0] pl-2">Peoples</div>
      <div className="w-full flex flex-col items-center gap-2 sm:gap-1  h-[100%] overflow-auto lg:scrollbar-thin  overflow-x-hidden">
        {error && <div className="my-5 text-gray-400 font-bold">{error}</div>}
        {loading && (
          <div className=" w-full h-full flex items-center justify-center">
            <Spinner />
          </div>
        )}
        {!loading &&
          !emptyResults &&
          filteredUsers.length === 0 &&
          users.length > 0 &&
          users.map((user) => {
            if (user._id === currentUser?._id) return;
            return (
              <div onClick={toggleSidbare} key={user._id} className="w-full">
                <People userInfo={user} />
              </div>
            );
          })}
        {!loading &&
          !emptyResults &&
          filteredUsers.length > 0 &&
          filteredUsers?.map((user) => {
            if (user._id === currentUser?._id) return;
            return (
              <div onClick={toggleSidbare} key={user._id} className="w-full">
                <People userInfo={user} />
              </div>
            );
          })}
        {emptyResults && <Empty emptyText="Empty" imgWidthHeight="w-8 h-8" />}
      </div>
    </div>
  );
};
export default ChatSidbare;
