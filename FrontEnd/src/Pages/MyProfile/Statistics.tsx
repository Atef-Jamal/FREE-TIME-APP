import { MdAutoAwesomeMosaic } from "react-icons/md";
import { BsFillClockFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { BiTask } from "react-icons/bi";
import { useAppSelector } from "../../context/hooks";
import { useFetchNotifications } from "../../tanstackQuery/queryFetch";
import { selectCurrentUser, selectUserAuth } from "../../context/appStateSlice";

const Statistics = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const userAuth = useAppSelector(selectUserAuth);

  const { data: statistics = [], error } = useFetchNotifications({ userAuth: userAuth === "authenticated" });

  const numReferredUsers = statistics.filter((item) => item.type === "REFERRER").length;
  const numCopletedTasks = statistics.filter(
    (item) => item.type === "GUESS-CARD" || item.type === "QUIZ-APP",
  ).length;

  return (
    <div className="flex h-[170px] w-[98%] flex-col justify-center gap-4 rounded-lg bg-[#222339] lg:h-[180px] lg:w-[49%]">
      <h1 className="pl-5 font-bold text-[#9ddf53] underline lg:text-xl">Statistics</h1>
      {error && <p className="text-center">{error.response?.data.error}</p>}

      <div className="mx-auto flex w-[90%] flex-wrap justify-between md:mx-3 lg:mx-6">
        <div className="mt-4 flex w-[49%] items-center gap-x-2">
          <div className="flex h-[29px] w-[29px] items-center justify-center rounded-lg bg-[#be914cb7] md:h-9 md:w-9 lg:h-10 lg:w-10">
            <FaUsers className="h-[17px] w-[17px] md:h-6 md:w-6 lg:h-8 lg:w-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-300">{numReferredUsers || 0}</span>
            <span className="text-[11px] text-[#b1b07f] sm:text-xs md:text-sm">Users Referred</span>
          </div>
        </div>
        <div className="mt-4 flex w-[49%] items-center gap-x-2">
          <div className="flex h-[29px] w-[29px] items-center justify-center rounded-lg bg-[#be914cb7] md:h-9 md:w-9 lg:h-10 lg:w-10">
            <MdAutoAwesomeMosaic className="h-[17px] w-[17px] md:h-6 md:w-6 lg:h-8 lg:w-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-300">{currentUser?.points}</span>
            <span className="text-[11px] text-[#b1b07f] sm:text-xs md:text-sm">Total Earnings</span>
          </div>
        </div>
        <div className="flex w-[49%] items-center gap-2 sm:w-[49%]">
          <div className="flex h-[29px] w-[29px] items-center justify-center rounded-lg bg-[#be914cb7] md:h-9 md:w-9 lg:h-10 lg:w-10">
            <BiTask className="h-[17px] w-[17px] md:h-6 md:w-6 lg:h-8 lg:w-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-300">{numCopletedTasks || 0}</span>
            <span className="text-[11px] text-[#b1b07f] sm:text-xs md:text-sm">completed Tasks</span>
          </div>
        </div>

        <div className="flex w-[49%] items-center gap-x-2">
          <div className="flex h-[29px] w-[29px] items-center justify-center rounded-lg bg-[#be914cb7] md:h-9 md:w-9 lg:h-10 lg:w-10">
            <BsFillClockFill className="h-[17px] w-[17px] md:h-6 md:w-6 lg:h-8 lg:w-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-300">{currentUser?.points}</span>
            <span className="text-[11px] text-[#b1b07f] sm:text-xs md:text-sm">Earnings last 30 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
