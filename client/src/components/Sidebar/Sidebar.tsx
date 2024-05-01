import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BiErrorAlt, BiMenu } from "react-icons/bi";
import { sidebareItems } from "../../helper/data";
import {
  setAllUnReadedMesseges,
  showPopup,
  toggleThisEntity,
} from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import messageSoundSrc from "../../assets/messageSound.wav";
import { handleApiError, makeRequest } from "../../utils";
import { TypePrivateMessage } from "../../types/privateChat";
import { useListenToEvent } from "../../hooks/hooks";

const Sidebar = () => {
  const { resizeSidebare, currentUser, allUnReadedMesseges } = useAppSelector(
    (state) => state.stateManeger
  );

  const dispatch = useAppDispatch();

  const messageSound = new Audio();
  messageSound.src = messageSoundSrc;

  useEffect(() => {
    const getAllUnReadedMsgs = async () => {
      if (!currentUser) {
        return;
      }
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
    if (currentUser) {
      getAllUnReadedMsgs();
    }
  }, [currentUser?._id]);

  useListenToEvent<TypePrivateMessage>({
    eventToListen: "private-message",
    onUpdate: (data) => {
      if (location.pathname.includes(data.sender._id) === false) {
        dispatch(
          setAllUnReadedMesseges({ type: "ADD-ONE", userId: data.sender._id })
        );
        messageSound.play();
      }
    },
  });

  return (
    <div
      className={`transition-all bg-[#29293a] ${
        resizeSidebare ? "w-[80px]" : "w-[250px]"
      } h-[92vh] sticky top-[75px] sm:hidden py-4 border-r border-r-gray-700 `}
    >
      <div
        onClick={() => dispatch(toggleThisEntity({ entity: "resizeSidebare" }))}
        className={`${
          !resizeSidebare ? "ml-auto mr-1" : "mx-auto"
        }  p-[10px] w-[65px] flex items-center justify-center rounded-md mb-2 hover:bg-[#40496975] `}
      >
        <BiMenu className="text-2xl" />
      </div>

      <ul className="flex flex-col w-full h-[75vh] overflow-scroll scrollbar-none">
        {sidebareItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
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
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
