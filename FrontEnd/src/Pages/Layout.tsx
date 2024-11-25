import { useEffect, useState } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { showPopup, toggleThisEntity } from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import Model from "../components/others/Model";
import Sidebar from "../components/sidebar/Sidebar";
import Navbare from "../components/navebare/Navbare";
import Footer from "../components/footer/Footer";
import DisktopChat from "../components/chats/PublicChat/DisktopChat/DisktopChat";
import LiveStats from "../components/liveStats/LiveStats";
import NavebareBottom from "../components/navebare/NavebareBottom";
import ToastNotify from "../components/others/ToastNotify";
import { Helmet } from "react-helmet-async";
import MusicPlayer from "../components/music/MusicPlayer";

const Layout = () => {
  const {
    currentUser,
    currentAccountRequestFullfiled,
    model,
    openMusicModal,
    hiddenLiveStats,
    isChatOpen,
    resizeSidebare,
  } = useAppSelector((state) => state.stateManeger);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSidbareMobile, setOpenSidbareMobile] = useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const redirectQuery = searchParams.get("redirectedfrom");
  const refQuery = searchParams.get("referrerUser");

  const isMobile = window.innerWidth <= 867;

  useEffect(() => {
    if (refQuery && !currentUser && currentAccountRequestFullfiled) {
      dispatch(toggleThisEntity({ entity: "openRegisterForm", value: true }));
    }
  }, [dispatch, refQuery, currentUser?._id, currentAccountRequestFullfiled]);

  useEffect(() => {
    if (redirectQuery) {
      let popupMessage = "";
      if (redirectQuery === "logout") {
        popupMessage = "Logout successfull";
      }
      if (redirectQuery === "login") {
        popupMessage = "Login successfull";
      }
      if (redirectQuery === "signup") {
        popupMessage = "Sign Up successfull";
      }
      if (popupMessage) {
        dispatch(
          showPopup({
            message: popupMessage,
            type: "SUCESS",
          })
        );
        setSearchParams(() => {
          searchParams.delete("redirectedfrom", redirectQuery);
          return searchParams;
        });
      }
    }
  }, [redirectQuery]);

  useEffect(() => {
    const handleNetworkOnline = () => {
      dispatch(showPopup({ message: "Back online", type: "SUCESS" }));
    };
    const handleNetworkOffline = () => {
      dispatch(
        showPopup({ message: "No internet connection", type: "ERROR_GENERAL" })
      );
    };

    window.addEventListener("online", handleNetworkOnline);
    window.addEventListener("offline", handleNetworkOffline);
    return () => {
      window.removeEventListener("online", handleNetworkOnline);
      window.removeEventListener("offline", handleNetworkOffline);
    };
  }, []);

  return (
    <div className="w-full">
      <Helmet>
        <title>FREE TIME</title>
      </Helmet>
      {model.status && <Model children={model.children} />}
      <div className=" h-[70px] sm:h-[55px] sticky top-0 z-[6] bg-[#22162c] flex items-center justify-center px-3 sm:px-1  border-b border-[#f8d3d32a]">
        <Navbare />
        <div
          className={`absolute top-0 left-0 z-[1] transition-all h-full  ${
            openMusicModal ? "block" : "hidden"
          }`}
        >
          <MusicPlayer />
        </div>
        <ToastNotify />
      </div>
      <div
        style={{
          minHeight: `calc(100dvh - 70px)`,
        }}
        className="flex"
      >
        <div
          onClick={() => {
            if (openSidbareMobile) setOpenSidbareMobile(false);
          }}
          className={`transition-all ${
            resizeSidebare ? "min-w-[80px] " : "min-w-[250px]"
          } ${
            !openSidbareMobile && "sm:-translate-x-[100%]"
          } sm:w-full sm:h-screen sm:fixed sm:top-[55px] left-0 z-[5] bg-[#0a02026c] `}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="sm:w-[250px] bg-[#29293a] h-full p-2 border-r border-[#f8cdcd36]"
          >
            <Sidebar setOpenSidbareMobile={setOpenSidbareMobile} />
          </div>
        </div>
        <div
          className={`${
            resizeSidebare ? "w-[90%]" : "w-[70%]"
          } sm:w-full flex flex-col flex-1 relative bg-[#202338]`}
        >
          <div
            className={`${
              hiddenLiveStats && "hidden"
            } border-b border-[#ffd7d728] w-full bg-[#1a1a25] sticky top-[70px] sm:top-[55px] z-[4] `}
          >
            <LiveStats />
          </div>
          <div className="min-h-[70dvh]">
            <Outlet />
          </div>
          {location.pathname !== "/privatechat" &&
            location.pathname !== "/chat" && (
              <div className="">
                <Footer />
              </div>
            )}
        </div>
        {!isMobile && (
          <div
            style={{ height: `calc(100dvh - 70px)` }}
            className={`sm:hidden w-[30%] lg:w-[38%] bg-[#202138] duration-300 border-l border-[#8a5f5f] fixed top-[70px] right-0 z-[4] ${
              isChatOpen ? " translate-x-0" : " translate-x-[100%]"
            }`}
          >
            <DisktopChat />
          </div>
        )}
      </div>
      <div className="hidden sm:block w-full bg-[#2b2b55] fixed bottom-0 z-[3]">
        <NavebareBottom setOpenSidbareMobile={setOpenSidbareMobile} />
      </div>
    </div>
  );
};

export default Layout;
