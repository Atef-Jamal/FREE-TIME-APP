import { dailyleaderboard } from "../assets";
import { MdLiveHelp } from "react-icons/md";
import UsersWinnerCard from "../components/Leaderboard/UsersWinnerCard";
import PeopleList from "../components/Leaderboard/PeopleList";
import { useScrollToElement } from "../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../types/userTypes";

type TypeCashedData = { users: User[]; allDataLength: number } | undefined;

const LeaderBoard = () => {
  const queryClinet = useQueryClient();
  const getTopThreeUsers: TypeCashedData = queryClinet.getQueryData(["users-leaderboard", 1]);
  const topThreeUsers = getTopThreeUsers?.users.slice(0, 3);

  useScrollToElement({});

  return (
    <div className=" bg-[#1d2c35] relative pt-8">
      <div className="flex justify-between items-center p-4 sm:justify-between  mx-16 sm:mx-0 ">
        <div className="flex gap-8 sm:gap-3 ">
          <button className="bg-[#83478398] p-4 sm:p-2 rounded-md text-yellow-300 tracking-wider sm:text-xs">
            $500 Daily
          </button>
          <button className="bg-[#3316168e] p-4 sm:p-2 rounded-md text-[#43d616] tracking-wider sm:border border-gray-500 sm:text-xs">
            $5000 Monthly
          </button>
        </div>
        <MdLiveHelp />
      </div>
      <div className="overflow-hidden relative flex justify-center items-center z-0 mt-16 sm:mt-8">
        <img
          alt={""}
          src={dailyleaderboard}
          className="w-[35%] h-[75%] sm:w-[70%] sm:max-w-[300px] mb-[8%] sm:mb-9 object-contain"
        />
        <div className=" bg-[#1f1f30] mx-auto rounded-full absolute top-[34%] sm:top-[44%] w-[185%] h-[800%]  z-[-1] "></div>
      </div>
      <div className="bg-[#1f1f30]">
        <div className="relative border-t-2 border-gray-400 bg-gradient-to-b from-[#1D2C35] to-slate-900  w-[50%] sm:w-[90%] sm:text-sm p-4 text-gray-200 tracking-wide after:absolute after:h-full after:w-[1.3px] after:bg-gradient-to-b after:from-slate-100 after:to-slate-900 after:top-0 after:right-0 before:absolute before:h-full before:w-[1.3px] before:bg-gradient-to-b before:from-slate-100 before:to-slate-900 before:top-0 before:left-0 mx-auto">
          The daily leaderboard will reward
          <span className="text-yellow-400"> $500</span> per day, and the monthly leaderboard{" "}
          <span className="text-yellow-400">$5000</span>. A total of{" "}
          <span className="text-yellow-400">$20,000 </span>in rewards for you this month!
        </div>
        <div className="sm:w-[98%] w-[90%] max-w-[1400px] mx-auto mt-36 mb-16">
          <div className="flex items-center justify-center">
            <UsersWinnerCard user={topThreeUsers && topThreeUsers[0]} index={0} />
          </div>
          <div className="flex flex-wrap sm:flex-col items-center justify-center xl:gap-x-[20%] gap-x-[35%] lg:mt-32 mt-16 gap-y-32">
            <UsersWinnerCard user={topThreeUsers && topThreeUsers[1]} index={1} />
            <UsersWinnerCard user={topThreeUsers && topThreeUsers[2]} index={2} />
          </div>
        </div>
        <div className="flex flex-col sm:w-[98%] w-[90%] max-w-[1400px] mx-auto">
          <PeopleList />
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
