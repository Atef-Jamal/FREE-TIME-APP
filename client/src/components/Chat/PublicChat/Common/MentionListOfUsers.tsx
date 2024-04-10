import { useEffect, useState } from "react";
// import { db } from "../../../../firebase";
// import { collection, getDocs } from "firebase/firestore";
import { User } from "../../../../types";
import { useAppSelector } from "../../../../context/Hooks";
import axios from "axios";

interface TypeProps {
  setUser: React.Dispatch<
    React.SetStateAction<{ _id: string; name: string } | null>
  >;
}

const MentionListOfUsers = ({ setUser }: TypeProps) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  if (!currentUser) {
    return;
  }
  const [usersList, setUsersList] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        const excludCurrentAccount = response.data.filter(
          (item: User) => item._id !== currentUser._id
        );
        setUsersList(excludCurrentAccount);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-[#141a36] w-full h-full flex flex-col items-center p-2 gap-1 overflow-scroll scrollbar-none">
      {usersList.length > 0 &&
        usersList.map((item: User) => (
          <p
            key={item._id}
            onClick={() => setUser({ _id: item._id, name: item.name })}
            className="text-xs font-bold tracking-wide px-3 py-2 w-full text-blue-700 bg-[#475aa02c] rounded-sm hover:bg-[#475aa06b]"
          >
            @{item.name}
          </p>
        ))}
    </div>
  );
};

export default MentionListOfUsers;
