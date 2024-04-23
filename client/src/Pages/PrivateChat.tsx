import { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useAppSelector } from "../context/Hooks";
import Welcome from "../components/Chat/PrivateChat/Welcome";
import Spinner from "../components/Others/Spinner";
import ChatSidbare from "../components/Chat/PrivateChat/ChatSidbare";

const PrivateChat = () => {
  const [openSidbare, setOpenSidbare] = useState<boolean>(true);
  const { currentUser, currentUserIsFetched, hiddenLiveStats } = useAppSelector(
    (state) => state.stateManeger
  );
  const { id } = useParams();

  const toggleSidbare = () => {
    setOpenSidbare((prev) => !prev);
  };

  const handleOpenSidbare = () => {
    if (openSidbare) return;
    setOpenSidbare(true);
  };

  if (!currentUserIsFetched) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="w-12 h-12 border-3" />
      </div>
    );
  }
  if (!currentUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Sign In First
      </div>
    );
  }

  return (
    <div
      style={{
        height: hiddenLiveStats
          ? window.innerWidth <= 867
            ? `calc(100dvh - 123px)`
            : "calc(100dvh - 75px)"
          : window.innerWidth <= 867
          ? `calc(100dvh - 163px)`
          : "calc(100dvh - 140px)",
      }}
      className=" absolute w-full right-0 flex items-center justify-center border"
    >
      <div className="lg:w-full w-full relative flex items-center h-full overflow-hidden">
        <div
          className={`transition-all lg:absolute top-0 left-0 w-[350px] sm:w-[250px] h-full z-[1] ${
            openSidbare ? "lg:translate-x-[0%]" : "lg:-translate-x-[100%]"
          } `}
        >
          <ChatSidbare toggleSidbare={toggleSidbare} />
        </div>
        <div className="h-full grow max-w-[800px] mx-auto">
          {id ? <Outlet /> : <Welcome handleOpenSidbare={handleOpenSidbare} />}
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
