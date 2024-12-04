import { dailyleaderboard } from "../assets";
import { MdLiveHelp } from "react-icons/md";
import UsersWinnerCard from "../components/Leaderboard/UsersWinnerCard";
import { useFetchAllUsers } from "../hooks";
import PeopleList from "../components/Leaderboard/PeopleList";
import { useScrollToElement } from "../hooks/commonHooks";

const LeaderBoard = () => {
  const { users } = useFetchAllUsers();
  useScrollToElement([users]);

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
      <div className="overflow-hidden relative flex justify-center items-center z-0 mt-16 sm:mt-8 h-52 ">
        <img
          alt={""}
          src={dailyleaderboard}
          className=" w-[35%] h-[75%] sm:w-[70%] mb-[8%] sm:mb-10"
        />
        <div className=" bg-[#1f1f30] mx-auto rounded-full absolute top-[34%] sm:top-[44%] w-[4000px] h-[4000px] sm:w-[1500px] sm:h-[1500px] z-[-1] "></div>
      </div>
      <div className="bg-[#1f1f30]">
        <div className="relative border-t-2 border-gray-400 bg-gradient-to-b from-[#1D2C35] to-slate-900  w-[50%] sm:w-[90%] sm:text-sm p-4 text-gray-200 tracking-wide after:absolute after:h-full after:w-[1.3px] after:bg-gradient-to-b after:from-slate-100 after:to-slate-900 after:top-0 after:right-0 before:absolute before:h-full before:w-[1.3px] before:bg-gradient-to-b before:from-slate-100 before:to-slate-900 before:top-0 before:left-0 mx-auto">
          The daily leaderboard will reward
          <span className="text-yellow-400"> $500</span> per day, and the
          monthly leaderboard <span className="text-yellow-400">$5000</span>. A
          total of <span className="text-yellow-400">$20,000 </span>in rewards
          for you this month!
        </div>
        <div className="flex items-center justify-evenly sm:gap-32 gap-24 flex-wrap py-32">
          {users
            .sort((a, b) => b.points - a.points)
            .slice(0, 3)
            .map((usr, index) => {
              return <UsersWinnerCard key={index} user={usr} index={index} />;
            })}
        </div>
        <div className="flex flex-col sm:w-[98%] w-[90%] max-w-[1400px] mx-auto mb-10">
          <PeopleList />
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
