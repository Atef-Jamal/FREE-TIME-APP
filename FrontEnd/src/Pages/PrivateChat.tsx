import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import Welcome from "../components/Chats/PrivateChat/Welcome";
import Spinner from "../components/Others/Spinner";
import ChatSidbare from "../components/Chats/PrivateChat/ChatSidbare";
import ChatBody from "../components/Chats/PrivateChat/ChatBody";
import { useSearchParams } from "react-router-dom";
import messageSoundSrc from "../assets/images/messageSound.mp3";
import { setActiveConversation } from "../context/StateManeger";
import { cn } from "../utils/common";

const PrivateChat = () => {
  const currentUserId = useAppSelector((state) => state.stateManeger.currentUser?._id);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const activeConversation = useAppSelector((state) => state.stateManeger.activeConversation);
  const hiddenLiveStats = useAppSelector((state) => state.stateManeger.hiddenLiveStats);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);
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
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="border-3 h-12 w-12" />
      </div>
    );
  }

  const height = {
    height: hiddenLiveStats
      ? smallScreen
        ? `calc(100dvh - 118px)`
        : "calc(100dvh - 55px)"
      : smallScreen
        ? `calc(100dvh - 158px)`
        : "calc(100dvh - 102px)",
  };

  return (
    <div style={height} className="bg-[#202338]">
      <div className="relative mx-auto h-full max-w-[1400px] overflow-hidden 2xl:flex 2xl:gap-x-4">
        <div
          className={cn(
            "absolute left-0 top-0 z-[1] h-full w-[80%] max-w-[450px] translate-x-[0%] transition-all 2xl:static",
            openSidbare && "-translate-x-[100%] 2xl:translate-x-0",
          )}
        >
          <ChatSidbare openSidbare={openSidbare} toggleSidbare={toggleSidbare} />
        </div>
        {activeConversation ? <ChatBody /> : <Welcome handleOpenSidbare={handleOpenSidbare} />}
      </div>
    </div>
  );
};

export default PrivateChat;
