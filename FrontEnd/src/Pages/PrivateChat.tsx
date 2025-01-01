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
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const activeConversation = useAppSelector((state) => state.stateManeger.activeConversation);
  const hiddenLiveStats = useAppSelector((state) => state.stateManeger.hiddenLiveStats);
  const isCurrentUserReqFinished = useAppSelector((state) => state.stateManeger.isCurrentUserReqFinished);
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
    if (secondPartyId && secondPartyId !== currentUser?._id) {
      dispatch(setActiveConversation(secondPartyId));
      localStorage.setItem("active-converstaion", secondPartyId);
      setSearchParams((prev) => {
        prev.delete("chat-with");
        return prev;
      });
    }
  }, [dispatch, secondPartyId, currentUser?._id, setSearchParams]);

  if (!isCurrentUserReqFinished) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="w-12 h-12 border-3" />
      </div>
    );
  }

  if (!currentUser) {
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
          className={`transition-all lg:absolute top-0 left-0 w-[350px] sm:w-[250px] h-full z-[1] ${
            openSidbare ? "lg:translate-x-[0%]" : "lg:-translate-x-[100%]"
          }`}
        >
          <ChatSidbare openSidbare={openSidbare} toggleSidbare={toggleSidbare} />
        </div>
        <div className="h-full flex-1 max-w-[800px] mx-auto">
          {activeConversation ? <ChatBody /> : <Welcome handleOpenSidbare={handleOpenSidbare} />}
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
