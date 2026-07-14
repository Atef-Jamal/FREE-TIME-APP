import { useCallback, useEffect, useState } from "react";
import {
  selectActiveSecondUserId,
  selectCurrentUser,
  selectHidenLiveStats,
  selectSmallScreen,
  selectUserAuth,
} from "../context/appStateSlice";
import { useAppSelector } from "../context/hooks";
import { cn } from "../utils";
import Welcome from "../features/chats/private-chat/components/Welcome";
import ChatSidebar from "../features/chats/private-chat/components/ChatSidebar";
import ChatBody from "../features/chats/private-chat/components/ChatBody";
import Spinner from "../components/Shared/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { updateTotalUnReadPrivateMsgsCache } from "../features/chats/private-chat/cache";

const PrivateChat = () => {
  const userAuth = useAppSelector(selectUserAuth);
  const currentUser = useAppSelector(selectCurrentUser);
  const secondUserId = useAppSelector(selectActiveSecondUserId);
  const hideLiveStats = useAppSelector(selectHidenLiveStats);
  const mobileScreen = useAppSelector(selectSmallScreen);
  const [openSidebar, setOpenSidebar] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const toggleSidebar = useCallback(() => {
    setOpenSidebar((prev) => !prev);
  }, []);

  const handleOpenSidebar = () => {
    if (openSidebar) return;
    setOpenSidebar(true);
  };
  useEffect(() => {
    updateTotalUnReadPrivateMsgsCache({ queryClient, type: "remove-all" });
  }, [queryClient]);

  if (userAuth === "pending") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  const height = {
    height: hideLiveStats
      ? mobileScreen
        ? `calc(100dvh - 115px)`
        : "calc(100dvh - 55px)"
      : mobileScreen
        ? `calc(100dvh - 155px)`
        : "calc(100dvh - 102px)",
  };

  return (
    <div style={height} className="bg-[#202338]">
      <div className="relative mx-auto h-full max-w-[1400px] overflow-hidden 2xl:flex 2xl:gap-x-4">
        <div
          className={cn(
            "absolute left-0 top-0 z-[1] h-full w-[80%] max-w-[450px] translate-x-[0%] transition-all 2xl:static",
            !openSidebar && "-translate-x-[100%] 2xl:translate-x-0",
          )}
        >
          <ChatSidebar openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
        </div>
        {secondUserId && currentUser && <ChatBody secondUserId={secondUserId} />}
        {!secondUserId && <Welcome handleOpenSidebar={handleOpenSidebar} />}
      </div>
    </div>
  );
};

export default PrivateChat;
