import { FaRankingStar, FaUserLarge } from "react-icons/fa6";
import Skeleton from "../Others/Skeleton";
import { empty } from "../../assets";
import { AxiosError } from "axios";
import { User } from "../../types/userTypes";

interface TypeProps {
  data: { users: User[]; allDataLength: number } | undefined;
  status: "error" | "success" | "pending";
  error: AxiosError<{ error: string }, any> | null;
  pageParam: number;
  setPageParam: React.Dispatch<React.SetStateAction<number>>;
}

const PeopleList = ({ status, data, error, pageParam, setPageParam }: TypeProps) => {
  return (
    <div>
      <div className=" w-full flex items-center justify-between bg-[#3b2f5cc4] rounded-[4px] ">
        <span className="w-[20%] border-r flex items-center justify-center gap-2 overflow-scroll scrollbar-none sm:text-sm text-[#86b3ee] py-3 font-bold">
          <FaRankingStar className="text-lg sm:text-sm" />
          Rank
        </span>
        <span className="w-[60%] border-r flex items-center justify-center gap-2 overflow-scroll scrollbar-none text-[#86b3ee] py-3 sm:text-sm font-bold">
          <FaUserLarge className="sm:text-sm " />
          Users
        </span>
        <span className="w-[20%] flex items-center justify-center overflow-scroll scrollbar-none text-[#86b3ee] py-3 sm:text-sm font-bold">
          points
        </span>
      </div>
      {error && <div className="text-center py-8">{error?.response?.data.error}</div>}
      {status === "pending" && (
        <>
          {[...Array(20).keys()].map((item) => (
            <Skeleton key={item} className="h-[40px] w-full my-2 rounded-md" />
          ))}
        </>
      )}

      {data?.users.map((user, index) => (
        <div
          key={user._id}
          className=" w-full flex items-center justify-between rounded-[4px] h-[50px] border-b border-gray-400"
        >
          <span className="w-[20%] flex items-center justify-center overflow-scroll scrollbar-none font-bold text-[#86b3ee] h-full border-r">
            <span className="rounded-md w-[50px] h-[40px] bg-[#e4b42f31] flex items-center justify-center text-[#c3ccf5] sm:text-sm">
              {(pageParam - 1) * 100 + index + 1}
            </span>
          </span>
          <span className="w-[60%]  flex items-center justify-evenly overflow-scroll scrollbar-none font-bold text-[#86b3ee] h-full border-r">
            <img
              src={user.profilePicture}
              alt=""
              className="w-10 h-10 sm:w-8 sm:h-8 rounded-full object-cover"
            />
            <span className="sm:text-sm whitespace-nowrap w-[70%] text-[#6baaf1ee]">{user.name}</span>
          </span>
          <span className=" w-[20%] flex items-center justify-center overflow-scroll scrollbar-none font-bold text-[#86b3ee] h-full sm:text-sm">
            {user.points}
          </span>
        </div>
      ))}
      {data && data.users.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-y-3 my-6">
          <img src={empty} alt="" className="w-12 h-12" />
          <p className="text-gray-500 font-bold">No More Peoples</p>
        </div>
      )}
      <ul className="w-[70%] sm:w-[95%] grid grid-cols-10 gap-x-2 gap-y-1 mx-auto my-10">
        {[...Array(20).keys()].map((item) => (
          <li
            key={item}
            onClick={() => setPageParam(item + 1)}
            className={`cursor-pointer p-1 text-sm font-bold text-center rounded-md ${pageParam === item + 1 ? "bg-[#92f16c] text-black" : "bg-[#393b61] text-gray-300"}`}
          >
            {item + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeopleList;
