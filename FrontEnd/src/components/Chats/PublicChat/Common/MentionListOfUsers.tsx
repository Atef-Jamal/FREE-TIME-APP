import { useAppSelector } from "../../../../context/Hooks";
import { User } from "../../../../types/userTypes";
import { useCloseMenuOnClickOutSide } from "../../../../hooks";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOnlineUsers } from "../../../../utils";

interface TypeProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setOpenMentionList: React.Dispatch<React.SetStateAction<boolean>>;
}

const MentionListOfUsers = ({ setUser, setOpenMentionList }: TypeProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);

  const {
    data: users = [],
    status,
    error,
  } = useQuery({
    queryKey: ["onlines-users"],
    queryFn: getOnlineUsers,
  });

  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    setOpenMentionList(false);
  };

  useCloseMenuOnClickOutSide({ menuRef, handleClose });

  if (!currentUser) {
    return;
  }

  return (
    <div
      ref={menuRef}
      onClick={() => setOpenMentionList(false)}
      style={{ scrollbarColor: "red" }}
      className="bg-[#141a36] w-full h-full flex flex-col items-center p-1 gap-1 overflow-auto sm:scrollbar-thin"
    >
      {error && <div className="w-full my-4">{error.response?.data.error}</div>}
      {status === "pending" && (
        <div className="w-full space-y-1">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="px-3 py-3 w-full animate-pulse bg-[#23388593] rounded-sm hover:bg-[#475aa06b] flex items-center justify-between"
            ></div>
          ))}
        </div>
      )}
      {users
        .sort((a, b) => {
          if (onlineUsers.includes(a._id) && !onlineUsers.includes(b._id)) return -1;
          return 1;
        })
        .map((user: User) => {
          if (user._id === currentUser._id) return;
          return (
            <div
              key={user._id}
              onClick={() => setUser(user)}
              className="px-3 py-2 w-full bg-[#475aa02c] rounded-sm hover:bg-[#475aa06b] flex items-center justify-between"
            >
              <p className=" text-blue-700 text-xs font-bold tracking-wide ">@{user.name}</p>
              {onlineUsers.includes(user._id) && (
                <span className="rounded-full bg-[#c92626] w-3 h-3 animate-pulse"></span>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default MentionListOfUsers;
