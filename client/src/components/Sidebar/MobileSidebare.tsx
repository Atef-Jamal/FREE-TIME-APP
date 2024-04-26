import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { RiCloseFill } from "react-icons/ri";
import { BsArrowDownShort } from "react-icons/bs";
import {
  setAllUnReadedMesseges,
  showPopup,
  toggleThisEntity,
} from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { sidebareItems } from "../../helper/data";
import { handleApiError, makeRequest } from "../../utils";
import { BiErrorAlt } from "react-icons/bi";

const MobileSidebare = () => {
  const { openSidebarMobile, currentUser, allUnReadedMesseges } =
    useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getAllUnReadedMsgs = async () => {
      try {
        const response = await makeRequest.get(
          "api/conversations/all/all-unreaded-count"
        );
        dispatch(
          setAllUnReadedMesseges({ type: "ADD-ALL", userId: response.data })
        );
      } catch (error) {
        dispatch(
          showPopup({
            status: true,
            message: handleApiError(error),
            icon: <BiErrorAlt />,
          })
        );
      }
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
          onClick={() =>
            dispatch(toggleThisEntity({ entity: "openSidebarMobile" }))
          }
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
                onClick={() => {}}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSidebare;
