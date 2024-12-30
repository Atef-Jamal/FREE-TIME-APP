import { memo, useEffect, useState } from "react";
import { MdLanguage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { crown, verifiedImage } from "../../assets";
import { useAppSelector } from "../../context/Hooks";
import { Link } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import UserImage from "../Others/UserImage";
import LiveStatsSkeleton from "./LiveStatsSkeleton";
import { TypeCashedUsers } from "../../types/userTypes";
import LangMenu from "./LangMenu";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../../utils";
import Spinner from "../Others/Spinner";

const LiveStats = memo(() => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);
  const [openLangMenu, setOpenLangMenu] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    status,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: ({ pageParam }) => getUsers({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastpage, _, pageParam) => {
      return lastpage.hasMore ? pageParam + 1 : undefined;
    },
    staleTime: 60 * 60 * 1000,
  });

  const users = data?.pages.map((page) => page.users).flat();
  const userHieghestPoints = data?.pages[0].userHighestPoints;

  useEffect(() => {
    if (!currentUser) return;
    queryClient.setQueryData(
      ["users"],
      (previous: TypeCashedUsers): TypeCashedUsers | undefined => {
        if (!previous) return;
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            return {
              ...page,
              users: page.users.map((user) => {
                if (user._id === currentUser._id) {
                  return currentUser;
                }
                return user;
              }),
            };
          }),
        };
      }
    );
  }, [currentUser, queryClient]);

  useEffect(() => {
    if (onlineUsers.length === 0) return;
    const func = async () => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    };
    func();
  }, [onlineUsers, queryClient]);

  return (
    <div className={`flex w-full`}>
      <div
        onClick={() => setOpenLangMenu(!openLangMenu)}
        className=" bg-[#222339] ml-2 sm:ml-1 flex items-center gap-2 p-[14px] sm:p-2 rounded-md my-1 relative"
      >
        <MdLanguage />
        <IoIosArrowDown />
        {openLangMenu && <LangMenu setOpenLangMenu={setOpenLangMenu} />}
      </div>
      <div className="flex items-center gap-2 xs:gap-[6px] overflow-auto scrollbar-none sm:scrollbar-thin pl-2  py-2 sm:py-1 w-full ">
        {status === "pending" && <LiveStatsSkeleton />}

        {error && (
          <div className="xs:text-xs tracking-wide font-bold text-red-400 w-full flex items-center justify-center gap-3 py-1">
            <FaExclamationCircle className="text-lg" />
            {error.message === "Network Error"
              ? "Network Error"
              : error.response?.data.error}
          </div>
        )}

        {status === "success" &&
          users?.map((user) => {
            const { _id, name, points, emailVerified } = user;
            const isOnline = onlineUsers.includes(_id);

            return (
              <Link
                key={_id}
                to={currentUser?._id === _id ? "/myprofile" : `/user/${_id}`}
                className="relative bg-[#222339] text-sm h-[45px] min-w-[200px] rounded-sm px-[10px] text-gray-400 flex items-center justify-between sm:h-[30px] sm:px-[5px] sm:min-w-[155px] sm:gap-1 "
              >
                {userHieghestPoints === _id && (
                  <span className="absolute -top-2 -left-2 w-5 h-5 -rotate-45">
                    <img src={crown} alt="" className="" />
                  </span>
                )}
                <div className="w-[35px] h-[30px] sm:w-[25px] sm:h-[20px]">
                  <UserImage user={user} />
                </div>
                <div className="flex flex-col">
                  <span className="overflow-hidden  font-boldsm:font-[400] text-xs sm:text-[9px] sm:tracking-wide w-[80px] truncate sm:-mb-1 text-[#dddbdb] tracking-wider">
                    {name}
                  </span>
                  <div className="flex items-center gap-8">
                    {isOnline && (
                      <span className="text-xs text-[#68e44a] font-bold tracking-wide sm:text-[9px]">
                        online
                      </span>
                    )}
                    {!isOnline && (
                      <span className="text-xs text-[#54724c] font-bold  tracking-wide sm:text-[9px]">
                        offline
                      </span>
                    )}
                    {emailVerified && (
                      <img
                        src={verifiedImage}
                        alt=""
                        className="w-4 h-4 sm:w-3 sm:h-3 object-contain -mt-[2px]"
                      />
                    )}
                  </div>
                </div>
                <span className=" sm:w-8 sm:h-6 w-9 h-8 sm:px-1 sm:text-[9px] flex items-center justify-center rounded-md bg-[#181616]  text-[#c1f018]">
                  {points}
                </span>
              </Link>
            );
          })}
        {isFetchNextPageError && (
          <button className="text-red-400 sm:text-sm text-nowrap px-4 sm:h-[30px] h-[45px] rounded-sm ">
            an error occurred
          </button>
        )}
        {hasNextPage && (
          <button
            className="sm:text-sm text-nowrap px-4 sm:h-[30px] h-[45px] rounded-sm bg-[#393957]"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {!isFetchingNextPage && "Load more"}
            {isFetchingNextPage && (
              <Spinner className="w-4 h-4 border-4 sm:border-2 mx-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
});

export default LiveStats;
