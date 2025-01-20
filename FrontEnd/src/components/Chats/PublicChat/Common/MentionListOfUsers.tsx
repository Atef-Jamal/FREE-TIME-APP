import { useAppSelector } from "../../../../context/Hooks";
import { IUser } from "../../../../types/userTypes";
import { useClickOutside } from "../../../../hooks";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOnlineUsers } from "../../../../utils";

interface IProps {
  setMentionedUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  setOpenMentionList: React.Dispatch<React.SetStateAction<boolean>>;
}

const MentionListOfUsers = ({ setMentionedUsers, setOpenMentionList }: IProps) => {
  const currentUserId = useAppSelector((state) => state.stateManeger.currentUser?._id);
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const {
    data: users = [],
    status,
    error,
  } = useQuery({
    queryKey: ["onlines-users"],
    queryFn: getOnlineUsers,
  });

  useClickOutside(menuRef, () => setOpenMentionList(false));

  return (
    <div
      ref={menuRef}
      onClick={() => setOpenMentionList(false)}
      style={{ scrollbarColor: "red" }}
      className="flex h-full w-full flex-col items-center gap-1 overflow-auto bg-[#141a36] p-1 sm:scrollbar-thin"
    >
      {error && <div className="my-4 w-full">{error.response?.data.error}</div>}
      {status === "pending" && (
        <div className="w-full space-y-1">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex w-full animate-pulse items-center justify-between rounded-sm bg-[#23388593] px-3 py-3 hover:bg-[#475aa06b]"
            ></div>
          ))}
        </div>
      )}
      {users
        .sort((a, b) => {
          if (onlineUsers.includes(a._id) && !onlineUsers.includes(b._id)) return -1;
          return 1;
        })
        .map((user: IUser) => {
          if (user._id === currentUserId) return;
          return (
            <div
              key={user._id}
              onClick={() => setMentionedUsers((prev) => [...prev, user])}
              className="flex w-full items-center justify-between rounded-sm bg-[#475aa02c] px-3 py-2 hover:bg-[#475aa06b]"
            >
              <p className="text-xs font-bold tracking-wide text-blue-700">@{user.name}</p>
              {onlineUsers.includes(user._id) && (
                <span className="h-3 w-3 animate-pulse rounded-full bg-[#c92626]"></span>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default MentionListOfUsers;
