import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { BsArrowDownShort } from "react-icons/bs";
import { BiMenu } from "react-icons/bi";
import { sidebareItems } from "../../helper/data";
import {
  setAllUnReadedMesseges,
  showPopup,
  toggleResizeSidebare,
} from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import axios from "axios";
import { TypePrivateMessage } from "../../types";
import messageSoundSrc from "../../assets/messageSound.wav";

const Sidebar = () => {
  const { resizeSidebare, currentUser, socet, token, allUnReadedMesseges } =
    useAppSelector((state) => state.stateManeger);
  const [offerExpanded, setOfferExpanded] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };

  const dispatch = useAppDispatch();

  const messageSound = new Audio();
  messageSound.src = messageSoundSrc;

  useEffect(() => {
    const getAllUnReadedMsgs = async () => {
      if (!currentUser) {
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:3000/api/conversations/all/allunreadedcount",
          { headers }
        );
        dispatch(
          setAllUnReadedMesseges({ type: "ADD-ALL", userId: response.data })
        );
      } catch (error) {
        console.log(error);
        dispatch(
          showPopup({ status: true, message: "failed to get unreadedMsges" })
        );
      }
    };
    if (currentUser) {
      getAllUnReadedMsgs();
    }
  }, [currentUser?._id]);

  const handleMessage = (data: TypePrivateMessage) => {
    if (location.pathname.includes(data.sender._id) === false) {
      dispatch(
        setAllUnReadedMesseges({ type: "ADD-ONE", userId: data.sender._id })
      );
      messageSound.play();
    }
  };
  useEffect(() => {
    if (socet) {
      socet.on("private-message", handleMessage);
      return () => {
        socet.off("private-message", handleMessage);
      };
    }
  }, [socet]);

  return (
    <div
      className={`transition-all bg-[#29293a] ${
        resizeSidebare ? "w-[80px]" : "w-[250px]"
      } h-[92vh] sticky top-[75px] sm:hidden py-4 border-r border-r-gray-700 `}
    >
      <div
        onClick={() => dispatch(toggleResizeSidebare())}
        className={`${
          !resizeSidebare ? "ml-auto mr-1" : "mx-auto"
        }  p-[10px] w-[65px] flex items-center justify-center rounded-md mb-2 hover:bg-[#40496975] `}
      >
        <BiMenu className="text-2xl" />
      </div>

      <div className="flex flex-col w-full h-[75vh] overflow-scroll scrollbar-none">
        {sidebareItems.map((item, index) => (
          <div key={index}>
            <NavLink
              to={item.path}
              onClick={() => {
                if (item.path === "offers") {
                  setOfferExpanded((prev) => !prev);
                }
              }}
              className={({ isActive }) =>
                `${isActive ? "bg-[#40496975]" : ""}  ${
                  resizeSidebare ? "self-center pl-0" : ""
                } transition-all hover:bg-[#40496975] flex items-center gap-1 py-2 mx-2 rounded-md mb-1 overflow-hidden`
              }
            >
              <span
                className={` relative transition-all duration-300 text-[16px] py-1 pl-5 pr-4 hover:rotate-[360deg]`}
              >
                {currentUser &&
                  allUnReadedMesseges.length > 0 &&
                  item.path === "privatechat" && (
                    <span className="absolute -top-[6px] right-[3px] w-5 h-5 text-xs font-bold flex items-center justify-center rounded-full bg-[#e23e32]">
                      {allUnReadedMesseges.length}
                    </span>
                  )}
                {item.icon}
              </span>
              {!resizeSidebare && (
                <span
                  className={
                    "font-bold tracking-wide text-gray-400 text-[14px] "
                  }
                >
                  {item.title}
                </span>
              )}
              {item.path === "offers" && !resizeSidebare && (
                <button
                  // onClick={() => setOfferExpanded((prev) => !prev)}
                  className="text-2xl ml-auto mr-1  bg-[#3f3f41c9] rounded-md px-3"
                >
                  <BsArrowDownShort />
                </button>
              )}
            </NavLink>
            {item.path === "offers" && (
              <div
                className={`transition-all ${
                  offerExpanded ? "h-[210px] my-2" : "h-0 overflow-hidden"
                }  border-l-[0.2px] border-[rgb(94,88,88)] flex flex-col items-center gap-2 w-[80%] ml-8 ${
                  resizeSidebare ? " ml-[10px] border-none" : ""
                }`}
              >
                {item.childern?.map((element, i) => (
                  <NavLink
                    key={i}
                    to={element.path}
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? "border-l-2 border-yellow-400 bg-gradient-to-r from-[#253f49] to-[#35354e00]"
                          : ""
                      } ${
                        resizeSidebare ? "justify-center" : "px-3"
                      } hover:bg-gradient-to-r hover:from-[#253f49] hover:to-[#35354e00]  border-l-1 py-2 w-full  lg:px-2 flex items-center gap-2 `
                    }
                  >
                    <span className="">{element.icon}</span>
                    <span
                      className={`transition-all ${
                        resizeSidebare ? "w-0 h-0 overflow-hidden" : "px-3"
                      } text-sm font-bold text-gray-400`}
                    >
                      {element.title}
                    </span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
