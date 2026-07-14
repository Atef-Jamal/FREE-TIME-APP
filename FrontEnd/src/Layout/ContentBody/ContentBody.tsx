import { Suspense, lazy, memo } from "react";
import { useAppSelector } from "../../context/hooks";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { cn } from "../../utils";
import LiveStats from "./LiveStats";
import Footer from "./Footer";
import { selectHidenLiveStats, selectSidebarCollapsed, selectSmallScreen } from "../../context/appStateSlice";

const DisktopChat = lazy(() => import("../../features/chats/public-chat/components/DisktopChat"));

interface IProps {
  openSidbareMobile: boolean;
  handleCloseMobileSidebare: (open: boolean) => void;
}

const ContentBody = memo(({ openSidbareMobile, handleCloseMobileSidebare }: IProps) => {
  const hideLiveStats = useAppSelector(selectHidenLiveStats);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const mobileScreen = useAppSelector(selectSmallScreen);

  const handleClose = () => {
    handleCloseMobileSidebare(false);
  };

  const sidebarHeigh = mobileScreen ? `calc(100dvh - 115px)` : `calc(100dvh - 55px)`;

  const sidebarWidth =
    !mobileScreen && sidebarCollapsed ? "65px" : !mobileScreen && !sidebarCollapsed ? "250px" : "100%";

  const contentWidth =
    !mobileScreen && sidebarCollapsed
      ? `calc(100% - 65px)`
      : !mobileScreen && !sidebarCollapsed
        ? `calc(100% - 250px)`
        : "100%";

  const sidebarClassName = cn(
    "fixed top-[55px] z-[5] flex -translate-x-[100%] flex-col overflow-auto  bg-[#0a0202bb] scrollbar-thin lg:sticky lg:translate-x-0 lg:transition-all",
    openSidbareMobile && "translate-x-[0%]",
  );

  return (
    <section className="flex">
      <div style={{ height: sidebarHeigh, width: sidebarWidth }} className={sidebarClassName}>
        <div onClick={handleClose} className={"h-full w-full backdrop-blur-sm"}>
          <Sidebar handleClose={handleClose} />
        </div>
      </div>
      <div
        style={{ width: contentWidth }}
        className="flex flex-col transition-all ease-in-out max-lg:mb-[60px]"
      >
        {!hideLiveStats && <Suspense children={<LiveStats />} />}
        <div
          style={{ minHeight: mobileScreen ? `calc(100dvh - 155px)` : `calc(100dvh - 102px)` }}
          className="flex-1"
        >
          <Outlet />
        </div>
        <Footer />
      </div>
      {!mobileScreen && <Suspense children={<DisktopChat />} />}
    </section>
  );
});

export default ContentBody;
