import { useEffect } from "react";
import io from "socket.io-client";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import {
  setOnlineUsers,
  setSocet,
  showPopup,
  toggleThisEntity,
} from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import Model from "../components/Others/Model";
import Sidebar from "../components/Sidebar/Sidebar";
import MobileSidebare from "../components/Sidebar/MobileSidebare";
import Navbare from "../components/Navebare/Navbare";
import Footer from "../components/Footer/Footer";
import DisktopChat from "../components/Chats/PublicChat/DisktopChat/DisktopChat";
import LiveStats from "../components/LiveStats/LiveStats";
import NavebareBottom from "../components/Navebare/NavebareBottom";
import OpenPopup from "../components/Others/OpenPopup";
import { Helmet } from "react-helmet-async";
import { useListenToSocketEvent } from "../hooks";

const Layout = () => {
  const {
    currentUser,
    currentAccountRequestFullfiled,
    resizeSidebare,
    isChatOpen,
    hiddenLiveStats,
    model,
  } = useAppSelector((state) => state.stateManeger);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const redirectQuery = searchParams.get("redirectedfrom");
  const referreQuery = searchParams.get("referrerUser");

  useEffect(() => {
    if (!currentUser?._id) return;
    const establishSocetConnection = () => {
      const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
        query: { userId: currentUser._id },
      });
      dispatch(setSocet(socket));
    };
    establishSocetConnection();
  }, [currentUser?._id]);

  useListenToSocketEvent<string[]>({
    eventToListen: "online-users",
    onUpdate: (data) => {
      const filtered = data.filter((userId) => userId !== "undefined");
      dispatch(setOnlineUsers(filtered));
    },
  });

  useEffect(() => {
    if (referreQuery && !currentUser && currentAccountRequestFullfiled) {
      dispatch(toggleThisEntity({ entity: "openRegisterForm", value: true }));
    }
  }, [dispatch, referreQuery, currentUser, currentAccountRequestFullfiled]);

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
            status: true,
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

  return (
    <div className="flex flex-col items-center justify-center relative">
      <Helmet>
        <title>FREE TIME</title>
      </Helmet>
      <div className="fixed top-4 w-fit z-[100]">
        <OpenPopup />
      </div>
      {model.status && <Model children={model.children} />}
      <Navbare />
      <div className="w-full flex bg-[#212134]">
        <Sidebar />
        <div
          className={`${
            resizeSidebare ? "outlet" : "outlete"
          } sm:w-full flex flex-col items-center relative `}
        >
          <LiveStats />
          <div className="flex flex-col items-center w-full">
            <div
              style={{
                minHeight: hiddenLiveStats
                  ? `${
                      window.screen.width < 800
                        ? `calc(100dvh - 123px)`
                        : `calc(100dvh - 76px)`
                    }`
                  : `${
                      window.screen.width < 800
                        ? `calc(100dvh - 165px)`
                        : `calc(100dvh - 142px)`
                    }`,
              }}
              className="w-full overflow-hidden"
            >
              <Outlet />
            </div>
            {location.pathname === "/chat" ||
            location.pathname.includes("/privatechat") ? undefined : (
              <div className="w-full">
                <Footer />
              </div>
            )}
          </div>
          <div
            style={{ height: `calc(100dvh - 75px)` }}
            className={`sm:hidden fixed bottom-0 right-0 z-[2] w-[30%] h-[90dvh] lg:w-[38%] bg-[#202138] border-l border-gray-600  transition-all ${
              isChatOpen ? " translate-x-0" : " -translate-x-[-100%]"
            } `}
          >
            <DisktopChat />
          </div>
        </div>
      </div>
      <NavebareBottom />
      <MobileSidebare />
    </div>
  );
};

export default Layout;
