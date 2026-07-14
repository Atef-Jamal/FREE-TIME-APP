import { FaRankingStar, FaUserLarge } from "react-icons/fa6";
import { cn } from "../../../utils";
import Skeleton from "../../../components/Shared/Skeleton";
import Empty from "../../../components/Shared/Empty";
import { ICashedLeaderboardUsers } from "../types";

interface IProps {
  data: ICashedLeaderboardUsers | undefined;
  status: "error" | "success" | "pending";
  error: string | null;
  pageParam: number;
  setPageParam: React.Dispatch<React.SetStateAction<number>>;
}

const PeopleList = ({ status, data, error, pageParam, setPageParam }: IProps) => {
  return (
    <div>
      <div className="flex w-full items-center justify-between rounded-[4px] bg-[#3b2f5cc4]">
        <span className="md:text-bas flex w-[20%] items-center justify-center gap-2 overflow-auto border-r py-3 text-sm font-bold text-[#86b3ee] scrollbar-none">
          <FaRankingStar className="text-sm md:text-base" />
          Rank
        </span>
        <span className="flex w-[60%] items-center justify-center gap-2 overflow-auto border-r py-3 text-sm font-bold text-[#86b3ee] scrollbar-none md:text-base">
          <FaUserLarge className="text-sm md:text-base" />
          Users
        </span>
        <span className="flex w-[20%] items-center justify-center overflow-auto py-3 text-sm font-bold text-[#86b3ee] scrollbar-none md:text-base">
          points
        </span>
      </div>
      {error && <div className="py-8 text-center">{error}</div>}
      {status === "pending" && (
        <>
          {[...Array(20).keys()].map((item) => (
            <Skeleton key={item} className="my-2 h-[40px]" />
          ))}
        </>
      )}

      {data?.users.map((user, index) => (
        <div
          key={user._id}
          className="flex h-[50px] w-full items-center justify-between rounded-[4px] border-b border-gray-400"
        >
          <span className="flex h-full w-[20%] items-center justify-center overflow-auto border-r font-bold text-[#86b3ee] scrollbar-none">
            <span className="leaderboardUserRankNumber flex h-[40px] w-[50px] items-center justify-center rounded-md bg-[#e4b42f31] text-sm text-[#c3ccf5] md:text-base">
              {(pageParam - 1) * 100 + index + 1}
            </span>
          </span>
          <span className="flex h-full w-[60%] items-center justify-evenly overflow-auto border-r font-bold text-[#86b3ee] scrollbar-none">
            <img
              src={user.profilePicture}
              alt=""
              className="h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
            />
            <span className="w-[70%] whitespace-nowrap text-[#6baaf1ee] sm:text-sm">{user.name}</span>
          </span>
          <span className="flex h-full w-[20%] items-center justify-center overflow-auto text-sm font-bold text-[#86b3ee] scrollbar-none md:text-base">
            {user.points}
          </span>
        </div>
      ))}

      {data && data.users.length === 0 && (
        <div className="mt-5">
          <Empty text="no more people" />
        </div>
      )}

      <ul className="mx-auto my-10 grid w-[95%] grid-cols-10 gap-1 md:w-[70%] md:grid-cols-12 md:gap-2">
        {[...Array(20).keys()].map((item) => (
          <li
            key={item}
            onClick={() => setPageParam(item + 1)}
            className={cn(
              "cursor-pointer rounded-md p-1 text-center text-sm font-bold",
              pageParam === item + 1 ? "bg-[#92f16c] text-black" : "bg-[#393b61] text-gray-300",
            )}
          >
            {item + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeopleList;
