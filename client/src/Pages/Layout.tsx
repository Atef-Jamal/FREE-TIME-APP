import { useEffect } from "react";
import io from "socket.io-client";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { setOnlineUsers, setSocet, showPopup } from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import Model from "../components/Others/Model";
import Sidebar from "../components/Sidebar/Sidebar";
import MobileSidebare from "../components/Sidebar/MobileSidebare";

import Navbare from "../components/Navebare/Navbare";
import Footer from "../components/Footer/Footer";
import DisktopChat from "../components/Chat/PublicChat/DisktopChat/DisktopChat";

import LiveStats from "../components/LiveStats/LiveStats";
import NavebareBottom from "../components/Navebare/NavebareBottom";

import OpenPopup from "../components/Others/OpenPopup";
import { Helmet } from "react-helmet-async";
import { FaRegCheckCircle } from "react-icons/fa";

const Layout = () => {
  const {
    currentUser,
    resizeSidebare,
    isChatOpen,
    hiddenLiveStats,
    socet,
    model,
  } = useAppSelector((state) => state.stateManeger);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const paramValue = searchParams.get("redirectedfrom");

  useEffect(() => {
    if (currentUser) {
      const socet = io(import.meta.env.VITE_BASE_URL, {
        query: { userId: currentUser._id },
      });
      dispatch(setSocet(socet));
    }
  }, [currentUser]);

  const handleOnlineUsers = (data: string[]) => {
    dispatch(setOnlineUsers(data));
  };

  useEffect(() => {
    if (socet) {
      socet.on("getOnlineUsers", handleOnlineUsers);
      return () => {
        socet.off("getOnlineUsers", handleOnlineUsers);
      };
    }
  }, [socet]);

  useEffect(() => {
    if (paramValue) {
      let popupMessage = "";
      if (paramValue === "logout") {
        popupMessage = "Logout successfull";
      }
      if (paramValue === "login") {
        popupMessage = "Login successfull";
      }
      if (paramValue === "signup") {
        popupMessage = "Sign Up successfull";
      }
      if (popupMessage) {
        dispatch(
          showPopup({
            status: true,
            message: popupMessage,
            icon: <FaRegCheckCircle />,
          })
        );
        setSearchParams(() => {
          searchParams.delete("redirectedfrom", paramValue);
          return searchParams;
        });
      }
    }
  }, [paramValue]);

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
            className={`sm:hidden fixed bottom-0 right-0 z-[2] w-[25%] h-[90dvh] lg:w-[35%] bg-[#202138] border-l border-gray-600  transition-all ${
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
