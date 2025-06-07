import { useCallback, useEffect, useState } from "react";
import {
  selectActiveChatId,
  selectHidenLiveStats,
  selectSmallScreen,
  selectUserAuth,
} from "../../context/appStateSlice";
import { useAppSelector } from "../../context/hooks";
import { cn } from "../../utilities";
import Welcome from "./Welcome";
import ChatSidebar from "./ChatSidebar";
import ChatBody from "./ChatBody";
import Spinner from "../../components/Shared/Common/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { updateAllUnreadPrivateMsgsCache } from "../../tanstackQuery/queryCache";
import type { IUnreadPrivateMsgsCache } from "../../types";

const PrivateChat = () => {
  const userAuth = useAppSelector(selectUserAuth);
  const activeChatId = useAppSelector(selectActiveChatId);
  const hideLiveStats = useAppSelector(selectHidenLiveStats);
  const smallScreen = useAppSelector(selectSmallScreen);
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
    const unReadMsgsCount: IUnreadPrivateMsgsCache | undefined = queryClient.getQueryData([
      "unread-private-messages-count",
    ]);
    if (unReadMsgsCount && unReadMsgsCount.senderIds.length > 0) {
      updateAllUnreadPrivateMsgsCache({ queryClient, type: "remove-all" });
    }
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
            "absolute left-0 top-0 z-[1] h-full w-[80%] max-w-[450px] translate-x-[0%] transition-all 2xl:static",
            !openSidebar && "-translate-x-[100%] 2xl:translate-x-0",
          )}
        >
          <ChatSidebar openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
        </div>
        {activeChatId && <ChatBody activeChatId={activeChatId} />}
        {!activeChatId && <Welcome handleOpenSidebar={handleOpenSidebar} />}
      </div>
    </div>
  );
};

export default PrivateChat;
