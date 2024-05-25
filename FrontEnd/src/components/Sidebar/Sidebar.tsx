import { BiMenu } from "react-icons/bi";
import { toggleThisEntity } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { sidebareItems } from "../../helper/data";
import { NavLink } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useListenToSocketEvent } from "../../hooks";
import { TypePrivateMessage } from "../../types/privateChatTypes";
import {
  showPopup,
  updateSidebarUnReadedMsgCount,
} from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";
import messageSoundSrc from "../../assets/images/messageSound.wav";
import { RiCloseFill } from "react-icons/ri";

// const Sidebar = () => {
// const { currentUser, allUnReadedMesseges } = useAppSelector(
//   (state) => state.stateManeger
// );
// const dispatch = useAppDispatch();
// const messageSound = new Audio();
// messageSound.src = messageSoundSrc;

// const handleCollaps = () =>
//   dispatch(toggleThisEntity({ entity: "resizeSidebare" }));

// const getAllUnReadedMsgs = async () => {
//   try {
//     const response = await makeRequest.get(
//       "api/conversations/all/all-unreaded-count"
//     );
//     dispatch(
//       updateSidebarUnReadedMsgCount({
//         type: "ADD-ALL",
//         userId: response.data,
//       })
//     );
//   } catch (error) {
//     dispatch(
//       showPopup({
//         status: true,
//         message: handleApiError(error),
//         type: "ERROR_GENERAL",
//       })
//     );
//   }
// };

// const handleAddNewPrivateMessage = (data: TypePrivateMessage) => {
//   if (location.pathname !== "/privatechat") {
//     dispatch(
//       updateSidebarUnReadedMsgCount({
//         type: "ADD-ONE",
//         userId: data.sender._id,
//       })
//     );
//     messageSound.play();
//   }
// };

// useListenToSocketEvent<TypePrivateMessage>({
//   eventToListen: "private-message",
//   onUpdate: handleAddNewPrivateMessage,
// });

// useEffect(() => {
//   if (
//     location.pathname === "/privatechat" &&
//     allUnReadedMesseges.length > 0
//   ) {
//     dispatch(
//       updateSidebarUnReadedMsgCount({
//         type: "REMOVE-ALL",
//       })
//     );
//   }
// }, [location.pathname, allUnReadedMesseges]);

// useEffect(() => {
//   if (currentUser?._id) {
//     getAllUnReadedMsgs();
//   }
// }, [currentUser?._id]);

//   return (
//     <div className={`w-full`}>
//       <div
//         onClick={handleCollaps}
//         className={`p-[10px] w-[65px] flex items-center justify-center rounded-md hover:bg-[#40496975] sm:hidden`}
//       >
//         <BiMenu className="text-2xl" />
//       </div>
//       <ul className="flex flex-col px-1 gap-1 w-full overflow-scroll scrollbar-none">
//         {sidebareItems.map((item, index) => {
//           return (
//             <li key={index}>
//               <NavLink
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `${
//                     isActive ? "bg-[#40496975]" : ""
//                   } transition-all hover:bg-[#40496975] flex items-center gap-1 py-2 rounded-md overflow-hidden`
//                 }
//               >
//                 <span
//                   className={` relative transition-all duration-300 text-[16px] py-1 pl-5 pr-4 hover:rotate-[360deg]`}
//                 >
//                   {currentUser &&
//                     allUnReadedMesseges.length > 0 &&
//                     item.path === "privatechat" && (
//                       <span className="absolute -top-[6px] right-[3px] w-5 h-5 text-xs font-bold flex items-center justify-center rounded-full bg-[#e23e32]">
//                         {allUnReadedMesseges.length}
//                       </span>
//                     )}
//                   {item.icon}
//                 </span>
//                 <span
//                   className={
//                     "font-bold tracking-wide text-gray-400 text-[14px] "
//                   }
//                 >
//                   {item.title}
//                 </span>
//               </NavLink>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

const Sidebar = ({
  setOpenSidbareMobile,
}: {
  setOpenSidbareMobile: Dispatch<SetStateAction<boolean>>;
}) => {
  const { currentUser, allUnReadedMesseges, resizeSidebare } = useAppSelector(
    (state) => state.stateManeger
  );
  const dispatch = useAppDispatch();
  const messageSound = new Audio();
  messageSound.src = messageSoundSrc;

  const handleCollaps = () =>
    dispatch(toggleThisEntity({ entity: "resizeSidebare" }));

  const getAllUnReadedMsgs = async () => {
    try {
      const response = await makeRequest.get(
        "api/conversations/all/all-unreaded-count"
      );
      dispatch(
        updateSidebarUnReadedMsgCount({
          type: "ADD-ALL",
          userId: response.data,
        })
      );
    } catch (error) {
      dispatch(
        showPopup({
          status: true,
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    }
  };

  const handleAddNewPrivateMessage = (data: TypePrivateMessage) => {
    if (location.pathname !== "/privatechat") {
      dispatch(
        updateSidebarUnReadedMsgCount({
          type: "ADD-ONE",
          userId: data.sender._id,
        })
      );
      messageSound.play();
    }
  };

  useListenToSocketEvent<TypePrivateMessage>({
    eventToListen: "private-message",
    onUpdate: handleAddNewPrivateMessage,
  });

  useEffect(() => {
    if (
      location.pathname === "/privatechat" &&
      allUnReadedMesseges.length > 0
    ) {
      dispatch(
        updateSidebarUnReadedMsgCount({
          type: "REMOVE-ALL",
        })
      );
    }
  }, [location.pathname, allUnReadedMesseges]);

  useEffect(() => {
    if (currentUser?._id) {
      getAllUnReadedMsgs();
    }
  }, [currentUser?._id]);

  const handleCloseSidbare = () => {
    setOpenSidbareMobile(false);
  };

  return (
    <div className="sticky top-[85px] sm:top-[55px] overflow-hidden">
      <div
        onClick={handleCollaps}
        className={`sm:hidden ml-auto mr-[6px] w-[51px] h-[40px] flex items-center justify-center rounded-md hover:bg-[#40496975]`}
      >
        <BiMenu className="text-2xl" />
      </div>

      <div className="hidden sm:flex items-center justify-between border-b border-gray-700">
        <span className="text-2xl text-[#74c43f] font-bold">
          FREE
          <span className="text-2xl text-[#d0ddc7] font-bold">TIME</span>
        </span>
        <span
          onClick={handleCloseSidbare}
          className="bg-[#489b2f] p-[4px] rounded-sm"
        >
          <RiCloseFill style={{ fontSize: "20px" }} />
        </span>
      </div>
      <ul className="flex flex-col px-1 gap-1 w-full overflow-scroll scrollbar-none mt-2">
        {sidebareItems.map((item, index) => {
          const isMobile = window.innerWidth <= 867;
          if (isMobile) {
            if (
              item.path === "leaderboard" ||
              item.path === "earn" ||
              item.path === "rewards"
            )
              return;
          }
          return (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#40496975]" : ""
                  } relative transition-all hover:bg-[#40496975] flex items-center gap-1 py-2 sm:py-1 rounded-md`
                }
              >
                <span
                  className={`transition-all duration-300 text-[16px] py-1 pl-4 pr-3 sm:px-2 hover:rotate-[360deg]`}
                >
                  {item.icon}
                </span>
                <span
                  className={`${
                    resizeSidebare && "hidden sm:flex"
                  } font-bold tracking-wide text-gray-400 text-sm `}
                >
                  {item.title}
                </span>
                {currentUser &&
                  allUnReadedMesseges.length > 0 &&
                  item.path === "privatechat" && (
                    <span className="absolute top-2 right-1 w-5 h-5 text-xs font-bold flex items-center justify-center rounded-full bg-[#e23e32]">
                      {allUnReadedMesseges.length}
                    </span>
                  )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
