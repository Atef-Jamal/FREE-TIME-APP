import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { showPopup, updateThisEntity } from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import Model from "../components/Others/Model";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbare from "../components/Navebare/Navbare";
import Footer from "../components/Footer/Footer";
import DisktopChat from "../components/Chats/PublicChat/DisktopChat/DisktopChat";
import LiveStats from "../components/LiveStats/LiveStats";
import NavebareBottom from "../components/Navebare/NavebareBottom";
import ToastNotify from "../components/Others/ToastNotify";
import MusicPlayer from "../components/Music/MusicPlayer";
import { debounce } from "../utils/common";
import HiddenComponent from "../components/Layout/HiddenComponent";

const Layout = () => {
  const model = useAppSelector((state) => state.stateManeger.model);
  const openMusicModal = useAppSelector((state) => state.stateManeger.openMusicModal);
  const hiddenLiveStats = useAppSelector((state) => state.stateManeger.hiddenLiveStats);
  const isChatOpen = useAppSelector((state) => state.stateManeger.isChatOpen);
  const isMobile = useAppSelector((state) => state.stateManeger.isMobile);
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
      if (window.innerWidth <= 867) {
        dispatch(updateThisEntity({ entity: "isMobile", value: true }));
      } else {
        dispatch(updateThisEntity({ entity: "isMobile", value: false }));
      }
    };
    const debouncedResize = debounce(handleResize, 100, timeOutRef);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [dispatch]);

  return (
    <div className="w-full">
      {model.status && <Model children={model.children} />}
      <div className=" h-[70px] sm:h-[55px] sticky top-0 z-[6] bg-[#22162c] flex items-center justify-center px-3 sm:px-1  border-b border-[#f8d3d32a]">
        <Navbare />
        {openMusicModal && (
          <div className={`absolute top-0 left-0 z-[1] transition-all h-full`}>
            <MusicPlayer />
          </div>
        )}
        <ToastNotify />
      </div>
      <div
        style={{
          minHeight: `calc(100dvh - 70px)`,
        }}
        className="flex"
      >
        <div
          onClick={() => handleCloseMobileSidebare(false)}
          className={`transition-all sm:transition-none ${
            resizeSidebare ? "min-w-[80px] " : "min-w-[250px]"
          } ${
            !openSidbareMobile && "sm:-translate-x-[100%]"
          } sm:w-full sm:h-screen sm:fixed sm:top-[55px] left-0 z-[5] bg-[#0a0202bb] `}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="sm:w-[250px] bg-[#29293a] h-full p-2 border-r border-[#f8cdcd36]"
          >
            <Sidebar handleCloseMobileSidebare={handleCloseMobileSidebare} />
          </div>
        </div>
        <div
          className={`${
            resizeSidebare ? "w-[90%]" : "w-[70%]"
          } sm:w-full flex flex-col flex-1 relative bg-[#202338]`}
        >
          {!hiddenLiveStats && (
            <div
              className={`border-b border-[#ffd7d728] w-full bg-[#1a1a25] sticky top-[70px] sm:top-[55px] z-[4] `}
            >
              <LiveStats />
            </div>
          )}
          <div className="min-h-[70dvh]">
            <Outlet />
          </div>
          <Footer />
        </div>
        {!isMobile && (
          <div
            style={{
              height: `calc(100dvh - 70px)`,
              transitionTimingFunction: `cubic-bezier(1, 0.5, 0.5, 0.5)`,
              transitionDuration: "300ms",
            }}
            className={`w-[30%] lg:w-[38%] bg-[#202138]  border-l border-[#8a5f5f] fixed top-[70px] right-0 z-[4] ${
              isChatOpen ? " translate-x-0" : " translate-x-[100%]"
            }`}
          >
            <DisktopChat />
          </div>
        )}
      </div>
      {isMobile && (
        <div className="w-full bg-[#2b2b55] fixed bottom-0 z-[3]">
          <NavebareBottom setOpenSidbareMobile={setOpenSidbareMobile} openSidbareMobile={openSidbareMobile} />
        </div>
      )}
      <HiddenComponent />
    </div>
  );
};

export default Layout;
