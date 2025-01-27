import { leaderboard_place1_winnings, leaderboard_place3_winnings, crown } from "../../assets";
import { IUser } from "../../types/userTypes";
import { cn } from "../../utilities";

interface IProps {
  user: IUser | undefined;
  index: number;
}

const UsersWinnerCard = ({ user, index }: IProps) => {
  return (
    <div
      id={index === 0 ? "top-earner" : undefined}
      className={cn(
        "relative flex w-[85%] flex-col items-center justify-center rounded-md border-t-[1px] py-10 pb-5 before:absolute before:left-0 before:top-1 before:h-[100%] before:w-[1.3px] before:bg-gradient-to-b before:from-slate-100 before:to-slate-900 after:absolute after:right-0 after:top-1 after:h-[100%] after:w-[1.3px] after:bg-gradient-to-b after:from-slate-100 after:to-slate-900 sm:w-[280px]",
        index === 0
          ? "bg-gradient-to-b from-[#69ff054b] to-[#1e29169c]"
          : "bg-gradient-to-b from-[#494957] to-[#222230]",
      )}
    >
      <div className="absolute top-[-100px] flex flex-col">
        <img alt={""} src={crown} className="h-20 w-20" />
        <span className="mt-[-20px] h-20 w-20 rounded-full border-2 bg-[#1f1f30]">
          <img src={user?.profilePicture} alt="" className="h-full w-full rounded-full" />
        </span>
      </div>
      <span className="mt-4 font-bold text-white">{user?.name}</span>
      <span className="my-2 rounded-md border bg-[#705555] px-3 py-1 font-bold">{user?.points}</span>
      <div
        className={
          "relative mx-auto h-[200px] w-[85%] rounded-md border-t-[0.5px] bg-gradient-to-b from-[#1F1F30] to-[#1f1f3073] before:absolute before:left-0 before:top-0 before:h-[100%] before:w-[1.3px] before:bg-gradient-to-b before:from-slate-100 before:to-slate-900 after:absolute after:right-0 after:top-0 after:h-[100%] after:w-[1.3px] after:bg-gradient-to-b after:from-slate-100 after:to-slate-900"
        }
      >
        <span className="absolute mx-3 my-3 rounded-md bg-[#494958] px-2 py-1 text-yellow-400">$ 35,000</span>
        <img
          alt={""}
          src={index === 0 ? leaderboard_place1_winnings : leaderboard_place3_winnings}
          className="absolute bottom-0 right-0 ml-20 h-40 w-40"
        />
      </div>
      <span
        className={cn(
          "absolute bottom-4 left-[-3%] flex flex-col overflow-hidden rounded-[5px] border-t-2 px-4 text-sm font-bold text-white md:text-2xl",
          index === 0 ? "bg-[#1ae62b]" : index === 1 ? "bg-[#838592]" : "bg-[#838592]",
        )}
      >
        {index === 0 && "1ND"}
        {index === 1 && "2ST"}
        {index === 2 && "3ND"}

        <span className="mt-[-5px] text-xs font-[200] text-white md:text-sm">PLACE</span>
        <span className="absolute bottom-4 left-[-7%] h-3 w-3 rotate-45 bg-slate-800 sm:bottom-3"></span>
      </span>
    </div>
  );
};

export default UsersWinnerCard;
