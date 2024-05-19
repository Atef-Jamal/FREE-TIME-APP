import { useAppSelector } from "../../../../context/Hooks";
import { User } from "../../../../types/userTypes";
import { useFetchAllUsers } from "../../../../hooks";
import Spinner from "../../../Others/Spinner";

interface TypeProps {
  setUser: React.Dispatch<
    React.SetStateAction<{ _id: string; name: string } | null>
  >;
  setOpenMentionList: React.Dispatch<React.SetStateAction<boolean>>;
}

const MentionListOfUsers = ({ setUser, setOpenMentionList }: TypeProps) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const { users, loading, error } = useFetchAllUsers();

  if (!currentUser) {
    return;
  }

  return (
    <div
      onClick={() => setOpenMentionList(false)}
      className="bg-[#141a36] w-full h-full flex flex-col items-center p-1 gap-1 overflow-auto scrollbar-thin"
    >
      {error && <div className="w-full my-4">{error}</div>}
      {loading && (
        <div className="w-full my-4">
          <Spinner className="mx-auto w-5 h-5 border-b-yellow-500 border-r-yellow-500" />
        </div>
      )}
      {users.length > 0 &&
        users.map((item: User) => {
          if (item._id === currentUser._id) return;
          return (
            <p
              key={item._id}
              onClick={() => setUser({ _id: item._id, name: item.name })}
              className="text-xs font-bold tracking-wide px-3 py-2 w-full text-blue-700 bg-[#475aa02c] rounded-sm hover:bg-[#475aa06b]"
            >
              @{item.name}
            </p>
          );
        })}
    </div>
  );
};

export default MentionListOfUsers;
