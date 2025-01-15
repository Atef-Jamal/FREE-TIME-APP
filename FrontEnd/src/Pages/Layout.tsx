import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { showPopup, updateThisEntity } from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbare from "../components/Navebare/Navbare";
import Model from "../components/Others/Model";
import ToastNotify from "../components/Others/ToastNotify";
import { cn, debounce } from "../utils/common";
import HiddenComponent from "../components/Layout/HiddenComponent";

const DisktopChat = lazy(() => import("../components/Chats/PublicChat/DisktopChat/DisktopChat"));
const LiveStats = lazy(() => import("../components/LiveStats/LiveStats"));
const Footer = lazy(() => import("../components/Footer/Footer"));
const MusicPlayer = lazy(() => import("../components/Music/MusicPlayer"));
const NavebareBottom = lazy(() => import("../components/Navebare/NavebareBottom"));

const Layout = () => {
  const model = useAppSelector((state) => state.stateManeger.model);
  const hiddenLiveStats = useAppSelector((state) => state.stateManeger.hiddenLiveStats);
  const openMusicModal = useAppSelector((state) => state.stateManeger.openMusicModal);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);
  const resizeSidebare = useAppSelector((state) => state.stateManeger.resizeSidebare);
  const [openSidbareMobile, setOpenSidbareMobile] = useState(false);
  const timeOutRef = useRef(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleNetworkOnline = () => {
      dispatch(showPopup({ message: "Back online", type: "SUCESS" }));
    };
    const handleNetworkOffline = () => {
      dispatch(showPopup({ message: "No internet connection", type: "ERROR_GENERAL" }));
    };

    window.addEventListener("online", handleNetworkOnline);
    window.addEventListener("offline", handleNetworkOffline);
    return () => {
      window.removeEventListener("online", handleNetworkOnline);
      window.removeEventListener("offline", handleNetworkOffline);
    };
  }, [dispatch]);

  const handleCloseMobileSidebare = useCallback((open: boolean) => {
    setOpenSidbareMobile(open);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        dispatch(updateThisEntity({ entity: "smallScreen", value: true }));
      } else {
        dispatch(updateThisEntity({ entity: "smallScreen", value: false }));
      }
    };
    const debouncedResize = debounce(handleResize, 100, timeOutRef);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [dispatch]);

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
    <main className="min-h-screen">
      {model.status && <Model children={model.children} />}
      {openMusicModal && <Suspense children={<MusicPlayer />} />}
      <ToastNotify />
      <Navbare />
      <section className="">
        <div className="flex">
          <div style={{ height: sidebarHeigh, width: sidebarWidth }} className={sidebarClassName}>
            <div onClick={() => handleCloseMobileSidebare(false)} className={"h-full w-full"}>
              <Sidebar />
            </div>
          </div>
          <div style={{ width: contentWidth }} className="transition-all ease-in-out">
            {!hiddenLiveStats && <Suspense children={<LiveStats />} />}
            <div

            // style={{ minHeight: smallScreen ? `calc(100vh - 158px)` : `calc(100vh - 102px)` }}
            >
              <Outlet />
            </div>
            <Suspense children={<Footer />} />
          </div>
        </div>
        {!smallScreen && <Suspense children={<DisktopChat />} />}
        {smallScreen && (
          <Suspense
            children={
              <NavebareBottom
                setOpenSidbareMobile={setOpenSidbareMobile}
                openSidbareMobile={openSidbareMobile}
              />
            }
          />
        )}
        <HiddenComponent />
      </section>
    </main>
  );
};

export default Layout;
