import { useCallback, useEffect, useState } from "react";
import { updateSidebarUnReadedMsgCount } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { cn } from "../../utilities";
import Welcome from "./Welcome";
import ChatSidebar from "./ChatSidebar";
import ChatBody from "./ChatBody";
import Spinner from "../../components/Shared/Common/Spinner";

const PrivateChat = () => {
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  const allUnReadedMesseges = useAppSelector((state) => state.appState.allUnReadedMesseges);
  const activeChatWithUserId = useAppSelector((state) => state.appState.activeChatWithUserId);
  const hiddenLiveStats = useAppSelector((state) => state.appState.hiddenLiveStats);
  const smallScreen = useAppSelector((state) => state.appState.smallScreen);
  const [openSidebar, setOpenSidebar] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const toggleSidebar = useCallback(() => {
    setOpenSidebar((prev) => !prev);
  }, []);

  const handleOpenSidebar = () => {
    if (openSidebar) return;
    setOpenSidebar(true);
  };

  useEffect(() => {
    if (allUnReadedMesseges.length > 0) {
      dispatch(
        updateSidebarUnReadedMsgCount({
          type: "REMOVE-ALL",
        }),
      );
    }
  }, [allUnReadedMesseges, dispatch]);

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
            "absolute left-0 top-0 z-[1] h-full w-[80%] max-w-[450px] translate-x-[0%] transition-all 2xl:static",
            !openSidebar && "-translate-x-[100%] 2xl:translate-x-0",
          )}
        >
          <ChatSidebar openSidebar={openSidebar} toggleSidebar={toggleSidebar} />
        </div>
        {activeChatWithUserId && <ChatBody activeChatWithUserId={activeChatWithUserId} />}
        {!activeChatWithUserId && <Welcome handleOpenSidebar={handleOpenSidebar} />}
      </div>
    </div>
  );
};

export default PrivateChat;
