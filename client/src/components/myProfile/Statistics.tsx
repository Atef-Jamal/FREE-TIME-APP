import { BsFillClockFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { MdAutoAwesomeMosaic } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { BiErrorAlt, BiTask } from "react-icons/bi";
import { useEffect, useState } from "react";
import { showPopup } from "../../context/StateManeger";
import { handleApiError, makeRequest } from "../../utils";
import { TypeNotifications } from "../../types/notification";

const Statistics = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [statistics, setStatistics] = useState<TypeNotifications[]>([]);
  const dispatch = useAppDispatch();

  const numReferredUsers = statistics.filter(
    (item) => item.type === "REFERRER"
  ).length;
  const numCopletedTasks = statistics.filter(
    (item) => item.type === "GUESS-CARD" || item.type === "QUIZ-APP"
  ).length;

  useEffect(() => {
    const getStatistics = async () => {
      try {
        const response = await makeRequest.get("api/notifications");
        setStatistics(response.data);
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
      getStatistics();
    }
  }, [currentUser]);

  return (
    <div className=" flex flex-col gap-4 w-[49%] sm:w-[98%] h-[180px] sm:h-[170px] rounded-lg bg-[#222339] justify-center  ">
      <h1 className="text-xl underline sm:text-[16px] font-bold text-[#9ddf53] pl-5 ">
        Statistics
      </h1>
      <div className="flex flex-wrap justify-between mx-6  sm:mx-auto lg:mx-3 w-[90%] ">
        <div className="flex items-center gap-2 w-[49%] sm:w-[49%] mt-4 ">
          <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-[29px] sm:h-[29px] rounded-lg bg-[#be914cb7] flex items-center justify-center">
            <FaUsers className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[17px] sm:h-[17px] " />
          </div>
          <div className="flex flex-col ">
            <span className="font-bold text-gray-300">
              {numReferredUsers || 0}
            </span>
            <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
              Users Referred
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2  w-[49%] sm:w-[49%]  mt-4">
          <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-[29px] sm:h-[29px] rounded-lg bg-[#be914cb7] flex items-center justify-center">
            <MdAutoAwesomeMosaic className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[17px] sm:h-[17px] " />
          </div>
          <div className="flex flex-col  ">
            <span className="font-bold text-gray-300">
              {currentUser?.points}
            </span>
            <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
              Total Earnings
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-[49%] sm:w-[49%]">
          <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-[29px] sm:h-[29px]  rounded-lg bg-[#be914cb7] flex items-center justify-center">
            <BiTask className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[17px] sm:h-[17px] " />
          </div>
          <div className="flex flex-col ">
            <span className="font-bold text-gray-300">
              {numCopletedTasks || 0}
            </span>
            <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
              completed Tasks
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-[49%] sm:w-[49%]">
          <div className="w-10 h-10 lg:w-9 lg:h-9 sm:w-[29px] sm:h-[29px] rounded-lg bg-[#be914cb7] flex items-center justify-center">
            <BsFillClockFill className="w-8 h-8 lg:w-6 lg:h-6 sm:w-[17px] sm:h-[17px] " />
          </div>
          <div className="flex flex-col ">
            <span className="font-bold text-gray-300">
              {currentUser?.points}
            </span>
            <span className="text-sm sm:text-[11px] lg:text-xs text-[#b1b07f]">
              Earnings last 30 days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
