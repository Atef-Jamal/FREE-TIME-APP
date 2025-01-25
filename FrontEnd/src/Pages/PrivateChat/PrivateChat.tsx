import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import messageSoundSrc from "../../assets/images/messageSound.mp3";
import { setActiveConversation } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { cn } from "../../utils/common";
import Welcome from "./Welcome";
import ChatSidebar from "./ChatSidebar";
import ChatBody from "./ChatBody";
import Spinner from "../../components/Shared/Common/Spinner";

const PrivateChat = () => {
  const currentUserId = useAppSelector((state) => state.stateManeger.currentUser?._id);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const activeConversation = useAppSelector((state) => state.stateManeger.activeConversation);
  const hiddenLiveStats = useAppSelector((state) => state.stateManeger.hiddenLiveStats);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSidebar, setOpenSidebar] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const messageSound = new Audio();
  messageSound.src = messageSoundSrc;

  const secondPartyId = searchParams.get("chat-with");

  const toggleSidebar = useCallback(() => {
    setOpenSidebar((prev) => !prev);
  }, []);

  const handleOpenSidebar = () => {
    if (openSidebar) return;
    setOpenSidebar(true);
  };
  console.log(openSidebar);
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
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  const height = {
    height: hiddenLiveStats
      ? smallScreen
        ? `calc(100dvh - 115px)`
        : "calc(100dvh - 55px)"
      : smallScreen
        ? `calc(100dvh - 155px)`
        : "calc(100dvh - 102px)",
  };

  return (
    <div style={height} className="bg-[#202338]">
      <div className="relative mx-auto h-full max-w-[1400px] overflow-hidden 2xl:flex 2xl:gap-x-4">
        <div
          className={cn(
            "absolute top-0 left-0 z-[1] h-full w-[80%] max-w-[450px] translate-x-[0%] transition-all 2xl:static",
            !openSidebar && "-translate-x-[100%] 2xl:translate-x-0",
          )}
        >
          <ChatSidebar openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
        </div>
        {activeConversation ? <ChatBody /> : <Welcome handleOpenSidebar={handleOpenSidebar} />}
      </div>
    </div>
  );
};

export default PrivateChat;
