import { useState } from "react";
import { MdLiveHelp } from "react-icons/md";
import { dailyleaderboard } from "../../assets";
import { useScrollToElement } from "../../hooks/useScrollToElement";
import UsersWinnerCard from "./UsersWinnerCard";
import PeopleList from "./PeopleList";
import { useFetchLeaderboardUsers } from "../../tanstackQuery/queryFetch";

const LeaderBoard = () => {
  const [pageParam, setPageParam] = useState(1);

  const { data, status, error } = useFetchLeaderboardUsers({ pageParam });

  const topThreeUsers = data?.users.slice(0, 3);

  useScrollToElement({});

  return (
    <div className="relative bg-[#1d2c35] pt-4 md:pt-8">
      <div className="flex items-center justify-between p-4 sm:justify-between lg:mx-16">
        <div className="flex gap-3 lg:gap-8">
          <button className="rounded-md bg-[#83478398] px-2 py-2 text-sm tracking-wider text-yellow-300 md:px-5 md:text-base">
            $500 Daily
          </button>
          <button className="rounded-md border border-gray-500 bg-[#3316168e] px-2 py-2 text-sm tracking-wider text-[#43d616] md:px-5 md:text-base">
            $5000 Monthly
          </button>
        </div>
        <MdLiveHelp />
      </div>
      <div className="relative z-0 overflow-hidden">
        <div className="mt-5 flex h-28 items-center justify-center">
          <img
            alt={""}
            src={dailyleaderboard}
            className="absolute -bottom-10 h-[250px] w-[250px] object-contain md:-bottom-20 md:h-[320px] md:w-[320px]"
          />
          <div className="absolute top-16 z-[-1] mx-auto h-[1600px] w-[1600px] rounded-full bg-[#1f1f30] sm:h-[2500px] sm:w-[2500px] md:h-[3800px] md:w-[3800px] lg:h-[6100px] lg:w-[6100px] xl:h-[13000px] xl:w-[13000px]"></div>
        </div>
      </div>
      <div className="bg-[#1f1f30]">
        <div className="relative mx-auto w-[90%] border-t-2 border-gray-400 bg-gradient-to-b from-[#1D2C35] to-slate-900 p-4 text-sm tracking-wide text-gray-200 before:absolute before:left-0 before:top-0 before:h-full before:w-[1.3px] before:bg-gradient-to-b before:from-slate-100 before:to-slate-900 after:absolute after:right-0 after:top-0 after:h-full after:w-[1.3px] after:bg-gradient-to-b after:from-slate-100 after:to-slate-900 lg:w-[50%] lg:text-base">
          The daily leaderboard will reward
          <span className="text-yellow-400"> $500</span> per day, and the monthly leaderboard{" "}
          <span className="text-yellow-400">$5000</span>. A total of{" "}
          <span className="text-yellow-400">$20,000 </span>in rewards for you this month!
        </div>
        <div className="mx-auto mb-16 mt-36 w-[98%] max-w-[1400px] lg:w-[90%]">
          <div className="flex items-center justify-center">
            <UsersWinnerCard user={topThreeUsers && topThreeUsers[0]} index={0} />
          </div>
          <div className="mx-4 mt-16 flex flex-col flex-wrap items-center justify-between gap-y-32 sm:mt-32 sm:flex-row xl:px-16">
            <UsersWinnerCard user={topThreeUsers && topThreeUsers[1]} index={1} />
            <UsersWinnerCard user={topThreeUsers && topThreeUsers[2]} index={2} />
          </div>
        </div>
        <div className="mx-auto flex w-[98%] max-w-[1400px] flex-col lg:w-[90%]">
          <PeopleList
            data={data}
            status={status}
            error={error?.response?.data.error || null}
            pageParam={pageParam}
            setPageParam={setPageParam}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
