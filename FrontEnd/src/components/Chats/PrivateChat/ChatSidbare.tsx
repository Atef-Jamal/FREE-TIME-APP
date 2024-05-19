import People from "./People";
import Spinner from "../../Others/Spinner";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../context/Hooks";
import { User } from "../../../types/userTypes";
import { useFetchAllUsers, useListenToEvent } from "../../../hooks";
import Empty from "../../Others/Empty";
import SearchBar from "../../Search/SearchBar";

const ChatSidbare = ({ toggleSidbare }: { toggleSidbare: () => void }) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const { users, setUsers, loading, error } = useFetchAllUsers(1);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filterVlaue, setFilterValue] = useState<string>("");
  const [emptyResults, setEmptyResults] = useState<boolean>(false);

  useListenToEvent<User>({
    eventToListen: "new-user-joined",
    onUpdate: (newUser) => {
      setUsers((prev) => [...prev, newUser]);
    },
  });

  useListenToEvent<User>({
    eventToListen: "user-updated",
    onUpdate: (updatedUser) => {
      setUsers((prev) => {
        const newArry = prev.map((usr) => {
          if (usr._id === updatedUser._id) {
            return updatedUser;
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
          users?.map((user: User) => {
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
          filteredUsers?.map((user: User) => {
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
