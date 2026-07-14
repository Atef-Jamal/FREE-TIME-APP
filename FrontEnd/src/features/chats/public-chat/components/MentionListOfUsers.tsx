import { useRef } from "react";
import { IUser } from "../../../../features/user/types";

import { useClickOutside } from "../../../../hooks/useClickOutside";
import Empty from "../../../../components/Shared/Empty";
import { useAppSelector } from "../../../../context/hooks";
import { selectCurrentUser } from "../../../../context/appStateSlice";
import { useFetchOnlineUsersData } from "../../../user/hooks";

interface IProps {
  setMentionedUsers: React.Dispatch<React.SetStateAction<Set<IUser>>>;
  setOpenMentionList: React.Dispatch<React.SetStateAction<boolean>>;
}

const MentionListOfUsers = ({ setMentionedUsers, setOpenMentionList }: IProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: users = [], status, error } = useFetchOnlineUsersData();
  const excludeCurrentUser = users.filter((u) => u._id !== currentUser?._id);
  useClickOutside(menuRef, () => setOpenMentionList(false));
  return (
    <div
      ref={menuRef}
      onClick={() => setOpenMentionList(false)}
      style={{ scrollbarColor: "red" }}
      className="scrollbar-custom flex h-full w-full flex-col items-center gap-1 overflow-auto bg-[#141a36] p-1 max-lg:scrollbar-thin"
    >
      {users?.length === 0 && status === "success" && (
        <div className="my-auto">
          <Empty text="no user online now" />
        </div>
      )}
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
      {excludeCurrentUser.map((user: IUser) => {
        return (
          <div
            key={user._id}
            onClick={() => setMentionedUsers((prev) => new Set(prev.add(user)))}
            className="flex w-full items-center justify-between rounded-sm bg-[#475aa02c] px-3 py-2 hover:bg-[#475aa06b]"
          >
            <p className="text-xs font-bold tracking-wide text-blue-700">@{user.name}</p>
            <span className="h-3 w-3 animate-pulse rounded-full bg-[#c92626]"></span>
          </div>
        );
      })}
    </div>
  );
};

export default MentionListOfUsers;
