import {
  leaderboard_place1_winnings,
  leaderboard_place3_winnings,
  crown,
} from "../../assets";
import { User } from "../../types/userTypes";

type TypeProps = {
  user: User;
  index: number;
};

const UsersWinnerCard = ({ user, index }: TypeProps) => {
  return (
    <div
      id={index === 0 ? "top-earner" : undefined}
      className={`relative py-10 flex flex-col items-center justify-center rounded-md ${
        index === 0
          ? "bg-gradient-to-b from-[#69ff054b] to-[#1e29169c]"
          : "bg-gradient-to-b from-[#494957] to-[#222230]"
      }  w-[300px] sm:w-[85%] pb-5 after:absolute after:h-[100%] after:w-[1.3px] after:bg-gradient-to-b after:from-slate-100 border-t-[1px] after:to-slate-900 after:top-1 after:right-0 before:absolute before:h-[100%] before:w-[1.3px] before:bg-gradient-to-b before:from-slate-100 before:to-slate-900 before:top-1 before:left-0`}
    >
      <div className="flex flex-col absolute top-[-100px]">
        <img alt={""} src={crown} className="w-20 h-20" />
        <span className="mt-[-20px] w-20 h-20 rounded-full bg-[#1f1f30] border-2">
          <img
            src={`${import.meta.env.VITE_SERVER_BASE_URL}/${
              user.profilePicture
            }`}
            alt=""
            className="w-full h-full rounded-full"
          />
        </span>
      </div>
      <span className="text-white font-bold mt-4">{user.name}</span>
      <span className="font-bold border bg-[#705555] rounded-md px-3 py-1 my-2">
        {user?.points}
      </span>
      <div
        className={`relative h-[200px] w-[85%] mx-auto border-t-[0.5px] rounded-md bg-gradient-to-b from-[#1F1F30] to-[#1f1f3073] after:absolute after:h-[100%] after:w-[1.3px] after:bg-gradient-to-b after:from-slate-100 after:to-slate-900 after:top-0 after:right-0 before:absolute before:h-[100%] before:w-[1.3px] before:bg-gradient-to-b before:from-slate-100 before:to-slate-900 before:top-0 before:left-0`}
      >
        <span className="my-3 mx-3 px-2 py-1 text-yellow-400 absolute rounded-md bg-[#494958]">
          $ 35,000
        </span>
        <img
          alt={""}
          src={
            index === 0
              ? leaderboard_place1_winnings
              : leaderboard_place3_winnings
          }
          className="w-40 h-40 ml-20 absolute bottom-0 right-0 "
        />
      </div>
      <span
        className={`border-t-2 absolute flex flex-col bottom-4 left-[-3%] ${
          index === 0 ? "bg-[#1ae62b]" : undefined
        } ${index === 1 ? "bg-[#838592]" : undefined} ${
          index === 2 ? "bg-[#838592]" : undefined
        }  text-white text-2xl px-4 sm:text-sm rounded-[5px] font-bold overflow-hidden`}
      >
        {index === 0 && "1ND"}
        {index === 1 && "2ST"}
        {index === 2 && "3ND"}

        <span className="text-white text-sm sm:text-xs mt-[-5px] font-[200]">
          PLACE
        </span>
        <span className="absolute bottom-4 sm:bottom-3 left-[-7%] w-3 h-3 bg-slate-800 rotate-45"></span>
      </span>
    </div>
  );
};

export default UsersWinnerCard;
