import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import Welcome from "../components/Chats/PrivateChat/Welcome";
import Spinner from "../components/Others/Spinner";
import ChatSidbare from "../components/Chats/PrivateChat/ChatSidbare";
import ChatBody from "../components/Chats/PrivateChat/ChatBody";
import { useSearchParams } from "react-router-dom";
import messageSoundSrc from "../assets/images/messageSound.mp3";
import { setActiveConversation } from "../context/StateManeger";

const PrivateChat = () => {
  const currentUserId = useAppSelector((state) => state.stateManeger.currentUser?._id);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const activeConversation = useAppSelector((state) => state.stateManeger.activeConversation);
  const hiddenLiveStats = useAppSelector((state) => state.stateManeger.hiddenLiveStats);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSidbare, setOpenSidbare] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const messageSound = new Audio();
  messageSound.src = messageSoundSrc;

  const secondPartyId = searchParams.get("chat-with");

  const toggleSidbare = useCallback(() => {
    setOpenSidbare((prev) => !prev);
  }, []);

  const handleOpenSidbare = () => {
    if (openSidbare) return;
    setOpenSidbare(true);
  };

  useEffect(() => {
    if (secondPartyId && secondPartyId !== currentUserId) {
      dispatch(setActiveConversation(secondPartyId));
      localStorage.setItem("active-converstaion", secondPartyId);
      setSearchParams((prev) => {
        prev.delete("chat-with");
        return prev;
      });
    }
  }, [dispatch, secondPartyId, currentUserId, setSearchParams]);

  if (currentUserStatus === "pending") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="w-12 h-12 border-3" />
      </div>
    );
  }

  if (currentUserStatus === "unauthenticated") {
    return <div className="w-full h-full flex items-center justify-center">Sign In First</div>;
  }

  return (
    <div
      style={{
        height: hiddenLiveStats
          ? window.innerWidth <= 867
            ? `calc(100dvh - 120px)`
            : "calc(100dvh - 70px)"
          : window.innerWidth <= 867
            ? `calc(100dvh - 161px)`
            : "calc(100dvh - 133px)",
      }}
      className="w-full h-full flex items-center justify-center bg-[#202338]"
    >
      <div className="w-full relative flex items-center h-full">
        <div
          className={`transition-all xl:absolute top-0 left-0 w-[450px] sm:w-[80%] sm:max-w-[450px] h-full z-[1] ${
            openSidbare ? "xl:translate-x-[0%]" : "xl:-translate-x-[100%]"
          }`}
        >
          <ChatSidbare openSidbare={openSidbare} toggleSidbare={toggleSidbare} />
        </div>
        <div className="h-full flex-1 max-w-[900px] mx-auto">
          {activeConversation ? <ChatBody /> : <Welcome handleOpenSidbare={handleOpenSidbare} />}
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
