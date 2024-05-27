// import { useEffect } from "react";
// import io from "socket.io-client";
// import { Outlet, useLocation, useSearchParams } from "react-router-dom";
// import {
//   setOnlineUsers,
//   setSocet,
//   showPopup,
//   toggleThisEntity,
// } from "../context/StateManeger";
// import { useAppDispatch, useAppSelector } from "../context/Hooks";
// import Model from "../components/Others/Model";
// import Sidebar from "../components/Sidebar/Sidebar";
// import MobileSidebare from "../components/Sidebar/MobileSidebare";
// import Navbare from "../components/Navebare/Navbare";
// import Footer from "../components/Footer/Footer";
// import DisktopChat from "../components/Chats/PublicChat/DisktopChat/DisktopChat";
// import LiveStats from "../components/LiveStats/LiveStats";
// import NavebareBottom from "../components/Navebare/NavebareBottom";
// import OpenPopup from "../components/Others/OpenPopup";
// import { Helmet } from "react-helmet-async";
// import { useListenToSocketEvent } from "../hooks";

// const Layout = () => {
//   const {
//     currentUser,
//     currentAccountRequestFullfiled,
//     resizeSidebare,
//     isChatOpen,
//     hiddenLiveStats,
//     model,
//     openSidebarMobile,
//   } = useAppSelector((state) => state.stateManeger);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const dispatch = useAppDispatch();
//   const location = useLocation();

//   const redirectQuery = searchParams.get("redirectedfrom");
//   const referreQuery = searchParams.get("referrerUser");

//   const handleUpdateOnlineUsers = (data: string[]) => {
//     const filtered = data.filter((userId) => userId !== "undefined");
//     dispatch(setOnlineUsers(filtered));
//   };

//   useEffect(() => {
//     const establishSocetConnection = () => {
//       const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
//         query: { userId: currentUser?._id },
//       });
//       dispatch(setSocet(socket));
//     };
//     establishSocetConnection();
//   }, [currentUser?._id]);

//   useListenToSocketEvent<string[]>({
//     eventToListen: "online-users",
//     onUpdate: handleUpdateOnlineUsers,
//   });

//   useEffect(() => {
//     if (referreQuery && !currentUser && currentAccountRequestFullfiled) {
//       dispatch(toggleThisEntity({ entity: "openRegisterForm", value: true }));
//     }
//   }, [dispatch, referreQuery, currentUser, currentAccountRequestFullfiled]);

//   useEffect(() => {
//     if (redirectQuery) {
//       let popupMessage = "";
//       if (redirectQuery === "logout") {
//         popupMessage = "Logout successfull";
//       }
//       if (redirectQuery === "login") {
//         popupMessage = "Login successfull";
//       }
//       if (redirectQuery === "signup") {
//         popupMessage = "Sign Up successfull";
//       }
//       if (popupMessage) {
//         dispatch(
//           showPopup({
//             status: true,
//             message: popupMessage,
//             type: "SUCESS",
//           })
//         );
//         setSearchParams(() => {
//           searchParams.delete("redirectedfrom", redirectQuery);
//           return searchParams;
//         });
//       }
//     }
//   }, [redirectQuery]);

//   return (
//     <div className="flex flex-col items-center justify-center relative border-2 border-yellow-400">
{
  /* <Helmet>
  <title>FREE TIME</title>
</Helmet>; */
}
// <div className="fixed top-4 w-fit z-[100]">
//   <OpenPopup />
// </div>
//       {model.status && <Model children={model.children} />}
//       <Navbare />
//       <div
//         style={{
//           minHeight: `calc(100dvh - 74px)`,
//         }}
//         className="border relative w-full flex bg-[#212134]"
//       >
//         <div
//           style={{
//             height: `calc(100dvh - 71px)`,
//           }}
//           className={`${
//             resizeSidebare ? "w-[80px] sm:w-auto" : "w-[250px] sm:w-full"
//           } transition-all bg-[#1d020241] sticky top-[75px] sm:fixed sm:top-[55px] sm:left-0 sm:z-[3] border-r border-r-gray-700 ${
//             !openSidebarMobile && "sm:-translate-x-[100%]"
//           }`}
//         >
//           <div className="border w-[250px] bg-[#29293a] h-full">
//             <Sidebar />
//           </div>
//         </div>
//         <div
//           className={`${
//             resizeSidebare ? "outlet" : "outlete"
//           } border sm:w-full flex flex-col items-center relative `}
//         >
//           <LiveStats />
//           <div className="flex flex-col items-center w-full">
//             <div className="w-full overflow-hidden">
//               <Outlet />
//             </div>
//             {location.pathname === "/chat" ||
//             location.pathname.includes("/privatechat") ? undefined : (
//               <div className="w-full">
//                 <Footer />
//               </div>
//             )}
//           </div>
//           {window.innerWidth > 867 && (
//             <div
//               style={{ height: `calc(100dvh - 75px)` }}
//               className={`sm:hidden fixed bottom-0 right-0 z-[2] w-[30%] lg:w-[38%] bg-[#202138] border-l border-gray-600  transition-all ${
//                 isChatOpen ? " translate-x-0" : " -translate-x-[-100%]"
//               } `}
//             >
//               <DisktopChat />
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="hidden sm:flex w-full fixed bottom-0 transition-all duration-700 ease-linear h-[68px] z-[3]  bg-[#2b2b55]  py-[2px]">
//         <NavebareBottom />
//       </div>
//     </div>
//   );
// };

// export default Layout;

import { useEffect, useState } from "react";
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
import Navbare from "../components/Navebare/Navbare";
import Footer from "../components/Footer/Footer";
import DisktopChat from "../components/Chats/PublicChat/DisktopChat/DisktopChat";
import LiveStats from "../components/LiveStats/LiveStats";
import NavebareBottom from "../components/Navebare/NavebareBottom";
import OpenPopup from "../components/Others/OpenPopup";
import { Helmet } from "react-helmet-async";
import { useListenToSocketEvent } from "../hooks";
import MusicPlayer from "../components/Music/MusicPlayer";

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
  const referreQuery = searchParams.get("referrerUser");

  const handleUpdateOnlineUsers = (data: string[]) => {
    const filtered = data.filter((userId) => userId !== "undefined");
    dispatch(setOnlineUsers(filtered));
  };

  useEffect(() => {
    const establishSocetConnection = () => {
      const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
        query: { userId: currentUser?._id },
      });
      dispatch(setSocet(socket));
    };
    establishSocetConnection();
  }, [currentUser?._id]);

  useListenToSocketEvent<string[]>({
    eventToListen: "online-users",
    onUpdate: handleUpdateOnlineUsers,
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
    <div className="w-full">
      <Helmet>
        <title>FREE TIME</title>
      </Helmet>

      {model.status && <Model children={model.children} />}
      <div className=" h-[70px] sm:h-[55px] sticky top-0 z-[5] bg-[#22162c] flex items-center justify-center px-3 sm:px-1  border-b border-[#f8d3d32a]">
        <Navbare />
        <div
          className={`absolute top-0 left-0 z-[1] transition-all h-full  ${
            openMusicModal ? "block" : "hidden"
          }`}
        >
          <MusicPlayer />
        </div>
        <div className="absolute top-3 sm:top-1 w-fit z-[20]">
          <OpenPopup />
        </div>
      </div>
      <div className="flex flex-1">
        <div
          onClick={() => {
            if (openSidbareMobile) setOpenSidbareMobile(false);
          }}
          className={`transition-all ${
            resizeSidebare ? "min-w-[80px] " : "min-w-[250px]"
          } ${
            !openSidbareMobile && "sm:-translate-x-[100%]"
          } sm:w-full sm:h-screen sm:fixed sm:top-[55px] left-0 z-[2] bg-[#0a02026c] `}
        >
          <div className="sm:w-[250px] bg-[#29293a] h-full p-2 border-r border-[#f8cdcd36]">
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
          <div className="">
            <Outlet />
          </div>
          {location.pathname !== "/privatechat" || location.pathname !== "/privatechat" ? (
            <div className="">
              <Footer />
            </div>
          ) : undefined}
          
        </div>
        <div
          style={{ height: `calc(100dvh - 70px)` }}
          className={`sm:hidden w-[30%] lg:w-[38%] bg-[#202138] duration-300 border-l border-[#8a5f5f] fixed top-[70px] right-0 z-[4] ${
            isChatOpen ? " translate-x-0" : " translate-x-[100%]"
          }`}
        >
          <DisktopChat />
        </div>
      </div>
      <div className="hidden sm:block w-full bg-[#2b2b55] fixed bottom-0 z-[3]">
        <NavebareBottom setOpenSidbareMobile={setOpenSidbareMobile} />
      </div>
    </div>
  );
};

export default Layout;
