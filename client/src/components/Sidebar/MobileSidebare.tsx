import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RiCloseFill } from "react-icons/ri";
import { BsArrowDownShort } from "react-icons/bs";
import {
  setAllUnReadedMesseges,
  toggleSidebarMobile,
} from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { sidebareItems } from "../../helper/data";
import { makeRequest } from "../../utils";

const MobileSidebare = () => {
  const { openSidebarMobile, currentUser, allUnReadedMesseges } =
    useAppSelector((state) => state.stateManeger);
  const [offerExpanded, setOfferExpanded] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getAllUnReadedMsgs = async () => {
      try {
        const response = await makeRequest.get(
          "api/conversations/all/allunreadedcount"
        );
        dispatch(
          setAllUnReadedMesseges({ type: "ADD-ALL", userId: response.data })
        );
      } catch (error) {}
    };
    if (currentUser?._id) {
      getAllUnReadedMsgs();
    }
  }, [currentUser?._id]);

  return (
    <div
      id={"mobile-sidebar"}
      style={{ height: `calc(100dvh - 70px)` }}
      className={`transition duration-200 ease-linear ${
        openSidebarMobile ? " translate-x-0" : "-translate-x-[100%] "
      } hidden sm:block fixed top-[54px] left-0 z-[2] w-[250px] border-r border-gray-700 bg-[#212134] p-2`}
    >
      <div className="flex items-center justify-between border-b border-gray-700 pb-2">
        <span className="text-2xl text-[#74c43f] font-bold">
          FREE<span className="text-2xl text-[#d0ddc7] font-bold">TIME</span>
        </span>
        <span
          onClick={() => dispatch(toggleSidebarMobile())}
          className="bg-[#489b2f] p-[4px] rounded-sm"
        >
          <RiCloseFill style={{ fontSize: "20px" }} />
        </span>
      </div>
      <div className="flex flex-col gap-1 mt-4 max-h-[450px] overflow-auto scrollbar-thin ">
        {sidebareItems.map((item, index) => {
          if (
            item.path === "leaderboard" ||
            item.path === "rewards" ||
            item.path === "earn"
          ) {
            return;
          }
          return (
            <div key={index}>
              <NavLink
                to={item.path}
                onClick={() => {
                  if (item.path === "offers") {
                    setOfferExpanded((prev) => !prev);
                  }
                }}
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#40496975]" : ""
                  } transition-all hover:bg-[#40496975] px-2 flex items-center gap-4 min-h-[40px] rounded-md overflow-hidden`
                }
              >
                <span className={"text-xl p-1"}>{item.icon}</span>
                <span
                  className={
                    "font-bold tracking-wide text-gray-400 text-[14px] "
                  }
                >
                  {item.title}
                </span>
                {currentUser &&
                  allUnReadedMesseges.length > 0 &&
                  item.path === "privatechat" && (
                    <span className="ml-auto w-5 h-5 text-xs font-bold flex items-center justify-center rounded-full bg-[#e23e32]">
                      {allUnReadedMesseges.length}
                    </span>
                  )}
                {item.path === "offers" && (
                  <button className="text-2xl ml-auto  rounded-md ">
                    <BsArrowDownShort />
                  </button>
                )}
              </NavLink>
              {item.path === "offers" && (
                <div
                  className={`transition-all ${
                    offerExpanded ? "h-[180px] my-2" : "h-0 overflow-hidden"
                  }  border-l-[0.2px] border-[rgb(94,88,88)] flex flex-col items-center gap-2 w-[80%] ml-4`}
                >
                  {item.childern?.map((element, index) => (
                    <NavLink
                      key={index}
                      to={element.path}
                      className={({ isActive }) =>
                        `${
                          isActive
                            ? "border-l-2 border-yellow-400 bg-gradient-to-r from-[#253f49] to-[#35354e00]"
                            : ""
                        }  px-5 text-sm border-l-1 py-1 w-full font-bold   lg:font-bold text-gray-400 `
                      }
                    >
                      {element.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSidebare;
