import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  setAllSongs,
  setOnlineUsers,
  setSocet,
  showPopup,
} from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import {
  Sidebar,
  MobileSidebare,
  Navbare,
  Footer,
  DisktopChat,
  LiveStats,
  NavebareBottom,
  OpenPopup,
} from "../components";
import { auth } from "../firebase";
import { updateDocument } from "../context/functions";
import io from "socket.io-client";
import Model from "../components/Others/Model";
import { Helmet } from "react-helmet-async";

const Layout = () => {
  const {
    currentUser,
    currentUserIsLoading,
    resizeSidebare,
    isChatOpen,
    hiddenLiveStats,
    socet,
    model,
  } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const fechSongs = async () => {
      const url =
        "https://deezerdevs-deezer.p.rapidapi.com/search?q=amr%20diab";
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "ea97c9aa5amsh33c80843d253d57p13e60ejsn31e5ff47a85c",
          "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        dispatch(setAllSongs(result.data));
      } catch (error) {
        dispatch(showPopup({ status: true, message: "Failed to Load Songs" }));
        console.error(error);
      }
    };
    if (!currentUserIsLoading) {
      fechSongs();
    }
  }, [currentUser]);

  useEffect(() => {
    const verifyUserDoc = async () => {
      const isVerified = auth.currentUser?.emailVerified;
      if (currentUser && currentUser.emailVerified === false && isVerified) {
        await updateDocument(
          import.meta.env.VITE_USERS_COLLECTION_NAME,
          currentUser._id,
          { emailVerified: true }
        );
      }
    };
    verifyUserDoc();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const socet = io("http://localhost:3000", {
        query: { userId: currentUser?._id },
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

  const handleewards = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (socet) {
      socet.on("daily-reward", handleewards);
      return () => {
        socet.off("daily-reward", handleewards);
      };
    }
  }, [socet]);
  // console.log([...Array(8).keys()]);
  // console.log(window.innerWidth);
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
          <div className="flex flex-col items-center w-full ">
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
                        ? `calc(100dvh - 173px)`
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
