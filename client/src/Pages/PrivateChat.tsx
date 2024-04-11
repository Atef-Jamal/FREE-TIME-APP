import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { MdMenu } from "react-icons/md";
import { User } from "../types";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import { Welcome, Friend, Spinner } from "../components";
import { IoClose } from "react-icons/io5";
import { showPopup } from "../context/StateManeger";
import { makeRequest } from "../utils";

const PrivateChat = () => {
  const { currentUser, hiddenLiveStats, socet } = useAppSelector(
    (state) => state.stateManeger
  );
  const [resized, setResized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const param = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const response = await makeRequest.get("api/users");
        setUsers(response.data);
      } catch (err) {
        console.log(err);
        dispatch(
          showPopup({ status: true, message: "Failed to load peoples" })
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  useEffect(() => {
    if (socet) {
      socet.on("new-user-register", handleAddUser);
      return () => {
        socet.off("new-user-register", handleAddUser);
      };
    }
  }, [socet]);

  return currentUser ? (
    <div
      style={{
        height: hiddenLiveStats
          ? `${
              window.screen.width < 867
                ? "calc(100dvh - 123px)"
                : "calc(100dvh - 80px)"
            } `
          : `${
              window.screen.width < 867
                ? "calc(100dvh - 173px)"
                : "calc(100dvh - 147px)"
            }`,
      }}
      className="sticky top-0 h-full w-full bg-[#202233] flex items-center justify-center p-2 xs:p-0"
    >
      <div
        className={`relative overflow-hidden flex items-center sm:w-full w-[80%] h-full bg-[#1c1031c9]`}
      >
        <div
          className={`transition-all ${
            resized ? "w-[50px]" : "xl:min-w-[280px] min-w-[380px]"
          }  lg:absolute top-0 left-0 z-[1] flex flex-col items-center gap-6 h-full bg-[#10102c] rounded-sm border-r border-b border-gray-600`}
        >
          <div
            className={
              "flex items-center justify-between gap-2 w-full py-3 px-2"
            }
          >
            {!resized && (
              <p className="ml-3 font-extrabold text-2xl lg:text-xl xl:text-[20px] text-[#f19c9c] tracking-wider whitespace-nowrap overflow-hidden ">
                CHATING NOW
              </p>
            )}
            <span className=" " onClick={() => setResized((prev) => !prev)}>
              {resized ? (
                <MdMenu className={`hidden xl:block text-3xl`} />
              ) : (
                <IoClose className={`hidden xl:block text-3xl`} />
              )}
            </span>
          </div>
          <div
            className={`${
              resized ? "w-0 overflow-hidden" : "w-full"
            } relative text-center `}
          >
            <input
              type="text"
              id="searc"
              autoComplete="off"
              className="bg-[#302742] rounded-md  font-bold w-[95%] mx-auto placeholder:text-gray-400  placeholder:font-bold text-gray-300 pl-10 pr-2 py-3 xs:py-2 outline-none"
              placeholder="Search..."
            />
            <div className="absolute top-3 left-5">
              <BsSearch className="text-xl xs:text-lg" />
            </div>
          </div>
          <div
            className={`${
              resized ? "-translate-x-[120px]" : ""
            } flex flex-col items-center gap-2 w-[95%] mx-auto h-[57dvh] overflow-scroll scrollbar-none`}
          >
            {loading && <Spinner />}
            {!loading &&
              users &&
              users?.map((user: User) => {
                if (user._id === currentUser?._id) return;
                return (
                  <Friend
                    key={user._id}
                    userInfo={user}
                    setResized={setResized}
                  />
                );
              })}
          </div>
        </div>
        <div
          className={`xl:max-w-full mx-auto max-w-[50%] xl:px-2 px-2 lg:pl-[55px] h-full flex flex-grow flex-col items-center pt-3 pr-3 bg-[#2f273d]`}
        >
          {param.id ? <Outlet /> : <Welcome setResized={setResized} />}
        </div>
      </div>
    </div>
  ) : (
    <div>Login first</div>
  );
};

export default PrivateChat;
