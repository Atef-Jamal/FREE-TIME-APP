import { Suspense, lazy, memo } from "react";
import { useAppSelector } from "../../context/Hooks";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { cn } from "../../utils/common";
import LiveStats from "./LiveStats";
import Footer from "./Footer";

const DisktopChat = lazy(() => import("../../Pages/PublichChat/DisktopChat"));

interface IProps {
  openSidbareMobile: boolean;
  handleCloseMobileSidebare: (open: boolean) => void;
}

const ContentBody = memo(({ openSidbareMobile, handleCloseMobileSidebare }: IProps) => {
  const hiddenLiveStats = useAppSelector((state) => state.appState.hiddenLiveStats);
  const sidebarCollapsed = useAppSelector((state) => state.appState.sidebarCollapsed);
  const smallScreen = useAppSelector((state) => state.appState.smallScreen);

  const sidebarHeigh = smallScreen ? `calc(100dvh - 115px)` : `calc(100dvh - 55px)`;

  const sidebarWidth =
    !smallScreen && sidebarCollapsed ? "65px" : !smallScreen && !sidebarCollapsed ? "250px" : "100%";

  const contentWidth =
    !smallScreen && sidebarCollapsed
      ? `calc(100% - 65px)`
      : !smallScreen && !sidebarCollapsed
        ? `calc(100% - 250px)`
        : "100%";

  const sidebarClassName = cn(
    "fixed top-[55px] z-[5] flex -translate-x-[100%] flex-col overflow-auto  bg-[#0a0202bb] scrollbar-thin lg:sticky lg:translate-x-0 lg:transition-all",
    openSidbareMobile && "translate-x-[0%]",
  );

  return (
    <section className="flex">
      <div style={{ height: sidebarHeigh, width: sidebarWidth }} className={sidebarClassName}>
        <div onClick={() => handleCloseMobileSidebare(false)} className={"h-full w-full backdrop-blur-sm"}>
          <Sidebar />
        </div>
      </div>
      <div
        style={{ width: contentWidth }}
        className="flex flex-col transition-all ease-in-out max-lg:mb-[60px]"
      >
        {!hiddenLiveStats && <Suspense children={<LiveStats />} />}
        <div
          style={{ minHeight: smallScreen ? `calc(100dvh - 155px)` : `calc(100dvh - 102px)` }}
          className="flex-1"
        >
          <Outlet />
        </div>
        <Footer />
      </div>
      {!smallScreen && <Suspense children={<DisktopChat />} />}
    </section>
  );
});

export default ContentBody;
