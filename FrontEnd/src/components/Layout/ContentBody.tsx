import { Suspense, lazy, memo } from "react";
import { useAppSelector } from "../../context/Hooks";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { cn } from "../../utils/common";
import LiveStats from "../LiveStats/LiveStats";
import Footer from "../Footer/Footer";

const DisktopChat = lazy(() => import("../Chats/PublicChat/DisktopChat/DisktopChat"));

interface TypeProps {
  openSidbareMobile: boolean;
  handleCloseMobileSidebare: (open: boolean) => void;
}

const ContentBody = memo(({ openSidbareMobile, handleCloseMobileSidebare }: TypeProps) => {
  const hiddenLiveStats = useAppSelector((state) => state.stateManeger.hiddenLiveStats);
  const resizeSidebare = useAppSelector((state) => state.stateManeger.resizeSidebare);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);

  const sidebarHeigh = smallScreen ? `calc(100vh - 115px)` : `calc(100vh - 55px)`;

  const sidebarWidth =
    !smallScreen && resizeSidebare ? "65px" : !smallScreen && !resizeSidebare ? "250px" : "100%";

  const contentWidth =
    !smallScreen && resizeSidebare
      ? `calc(100% - 65px)`
      : !smallScreen && !resizeSidebare
        ? `calc(100% - 250px)`
        : "100%";

  const sidebarClassName = cn(
    "fixed top-[55px] z-[5] flex -translate-x-[100%] flex-col overflow-auto border-r border-r-gray-500 bg-[#0a0202bb] scrollbar-thin lg:sticky lg:translate-x-0 lg:transition-all",
    openSidbareMobile && "translate-x-[0%]",
  );

  return (
    <section className="flex">
      <div style={{ height: sidebarHeigh, width: sidebarWidth }} className={sidebarClassName}>
        <div onClick={() => handleCloseMobileSidebare(false)} className={"h-full w-full"}>
          <Sidebar />
        </div>
      </div>
      <div
        style={{ width: contentWidth }}
        className="transition-all ease-in-out max-lg:mb-[60px]"
      >
        {!hiddenLiveStats && <Suspense children={<LiveStats />} />}
        <div
          style={{ minHeight: smallScreen ? `calc(100dvh - 158px)` : `calc(100dvh - 102px)` }}
         
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
