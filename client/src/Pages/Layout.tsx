import { lazy, useEffect } from "react";
import io from "socket.io-client";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { setOnlineUsers, setSocet, showPopup } from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
const Model= lazy(() => import("../components/Others/Model"))
const Sidebar= lazy(() => import("../components/Sidebar/Sidebar"))
const MobileSidebare= lazy(() => import("../components/Sidebar/MobileSidebare"))
const Navbare= lazy(() => import("../components/Navebare/Navbare"))
const Footer= lazy(() => import("../components/Footer/Footer"))
const DisktopChat= lazy(() => import("../components/Chat/PublicChat/DisktopChat/DisktopChat"))
const LiveStats= lazy(() => import("../components/LiveStats/LiveStats"))
const NavebareBottom= lazy(() => import("../components/Navebare/NavebareBottom"))
const OpenPopup= lazy(() => import("../components/Others/OpenPopup"))
import { Helmet } from "react-helmet-async";

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
      const socet = io("http://localhost:3000", {
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
        dispatch(showPopup({ status: true, message: popupMessage }));
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

      <OpenPopup />
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
            className={`sm:hidden fixed bottom-0 right-0 z-[2] w-[25%] h-[90dvh] lg:w-[35%] bg-[#202138] border-l border-gray-600  transition-all publicchatclass ${
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
