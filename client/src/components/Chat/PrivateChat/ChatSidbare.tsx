import People from "./People";
import Spinner from "../../Others/Spinner";
import { BsSearch } from "react-icons/bs";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useEffect, useState } from "react";
import { BiErrorAlt } from "react-icons/bi";
import { handleApiError, makeRequest } from "../../../utils";
import { showPopup } from "../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { User } from "../../../types";

const ChatSidbare = ({ toggleSidbare }: { toggleSidbare: () => void }) => {
  const { currentUser, socet } = useAppSelector((state) => state.stateManeger);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);

  const dispatch = useAppDispatch();

  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const response = await makeRequest.get("api/users");
        setUsers(response.data);
      } catch (error) {
        dispatch(
          showPopup({
            status: true,
            message: handleApiError(error),
            icon: <BiErrorAlt />,
          })
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (socet) {
      socet.on("new-user-register", handleAddUser);
      return () => {
        socet.off("new-user-register", handleAddUser);
      };
    }
  }, [socet]);

  return (
    <div className="relative  h-full flex flex-col items-center gap-2 p-2 sm:p-1 bg-[#131129]">
      <span
        onClick={toggleSidbare}
        className="hidden lg:flex items-center justify-center  absolute top-0 -right-9 w-9 h-9 bg-[#5353a8] rounded-sm"
      >
        <MdKeyboardDoubleArrowRight className="text-2xl" />
      </span>

      <div className={`w-full relative text-center mt-2`}>
        <input
          type="text"
          id="searc"
          autoComplete="off"
          className="bg-[#0b0c1a] rounded-sm w-full mx-auto outline-none pl-7 py-3 sm:py-2 text-sm"
          placeholder="Search..."
        />
        <div className="absolute top-[10px] left-2 sm:left-1 ">
          <BsSearch className="" />
        </div>
      </div>
      <div className="w-full text-[#81bef0] pl-2">Peoples</div>
      <div className="w-full flex flex-col items-center gap-2 sm:gap-1  h-[100%] overflow-auto lg:scrollbar-thin  overflow-x-hidden">
        {loading && (
          <div className=" w-full h-full flex items-center justify-center">
            <Spinner />
          </div>
        )}
        {!loading &&
          users.length > 0 &&
          users?.map((user: User) => {
            if (user._id === currentUser?._id) return;
            return (
              <div onClick={toggleSidbare} key={user._id} className="w-full">
                <People userInfo={user} />
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default ChatSidbare;
