import { dailyleaderboard } from "../assets";
import { MdLiveHelp } from "react-icons/md";
import UsersWinnerCard from "../components/Leaderboard/UsersWinnerCard";
import { FaRankingStar, FaUserLarge } from "react-icons/fa6";
import { useFetchAllUsers } from "../hooks";

const LeaderBoard = () => {
  const { users } = useFetchAllUsers();

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
        <div className="relative border-t-2 border-gray-400 bg-gradient-to-b from-[#1D2C35] to-slate-900  w-[50%] sm:w-[90%] sm:text-sm p-4 text-gray-200 tracking-wide after:absolute after:h-[100%] after:w-[1.3px] after:bg-gradient-to-b after:from-slate-100 after:to-slate-900 after:top-0 after:right-0 before:absolute before:h-[100%] before:w-[1.3px] before:bg-gradient-to-b before:from-slate-100 before:to-slate-900 before:top-0 before:left-0 mx-auto">
          The daily leaderboard will reward
          <span className="text-yellow-400"> $500</span> per day, and the
          monthly leaderboard <span className="text-yellow-400">$5000</span>. A
          total of <span className="text-yellow-400">$20,000 </span>in rewards
          for you this month!
        </div>
        <div className="flex items-center justify-evenly sm:gap-32 gap-24 flex-wrap py-32">
          {users.slice(0, 2).map((usr, index) => {
            return <UsersWinnerCard key={index} user={usr} index={index} />;
          })}
        </div>
        <div className="flex flex-col pb-10 sm:w-[98%] w-[90%] max-w-[900px] mx-auto ">
          <div className=" w-full flex items-center justify-between bg-[#3b2f5cc4] rounded-[4px] ">
            <span
              style={{ width: `calc(95% / 3)` }}
              className="border-r flex items-center justify-evenly overflow-scroll scrollbar-none font-bold text-[#86b3ee] py-1"
            >
              <FaRankingStar className="text-lg opacity-50" />
              Rank
            </span>
            <span
              style={{ width: `calc(100% / 3)` }}
              className="border-r flex items-center justify-evenly overflow-scroll scrollbar-none font-bold text-[#86b3ee] py-1"
            >
              <FaUserLarge className="opacity-50" />
              User
            </span>
            <span
              style={{ width: `calc(100% / 3)` }}
              className="flex items-center justify-center overflow-scroll scrollbar-none font-bold text-[#86b3ee] py-1"
            >
              points
            </span>
          </div>
          {users.map((user, index) => (
            <div
              key={user._id}
              className=" w-full flex items-center justify-between bg-[#] rounded-[4px] py-2"
            >
              <span
                style={{ width: `calc(95% / 3)` }}
                className="flex items-center justify-center overflow-scroll scrollbar-none font-bold text-[#86b3ee] py-1"
              >
                <span className="w-9 rounded-md h-[92%] bg-[#e4b42f31] flex items-center justify-center text-[#c3ccf5] ">
                  {index + 1}
                </span>
              </span>
              <span
                style={{ width: `calc(100% / 3)` }}
                className="flex items-center justify-evenly overflow-scroll scrollbar-none font-bold text-[#86b3ee] py-[6px]"
              >
                <span className="xs:w-5 xs:h-5 w-7 h-7 rounded-full min-w-fit min-h-fit">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/${
                      user.profilePicture
                    }`}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </span>
                <span className="xs:text-xs text-sm whitespace-nowrap w-[70%] text-[#6baaf1ee]">
                  {user.name}
                </span>
              </span>
              <span
                style={{ width: `calc(100% / 3)` }}
                className="flex items-center justify-center overflow-scroll scrollbar-none font-bold text-[#86b3ee] py-1 text-sm"
              >
                {user.points}
              </span>
            </div>
          ))}
          <ul className="flex gap-2 items-center  mx-auto mt-12 sm:mt-6 sm:w-[90%] sm:gap-1 sm:flex-wrap justify-center">
            {[...Array(11).keys()].map((item) => (
              <li
                key={item}
                className={`flex items-center justify-center w-[40px]  h-[40px] sm:text-sm  text-black rounded-md ${
                  item === 0 ? "bg-[#92f16c]" : "bg-[#393b61]"
                }`}
              >
                {item + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
