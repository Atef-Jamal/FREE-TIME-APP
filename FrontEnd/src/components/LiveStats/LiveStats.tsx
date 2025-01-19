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

  const { data, status, error, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError } =
    useInfiniteQuery({
      queryKey: ["live-stats-users"],
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
      ["live-stats-users"],
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
      },
    );
    queryClient.invalidateQueries({ queryKey: ["leaderboard-users"] });
  }, [currentUser, queryClient]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["live-stats-users"] });
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [onlineUsers, queryClient]);

  return (
    <div
      className={`sticky top-[55px] z-[4] flex h-[40px] items-center border-b border-[#ffd7d728] bg-[#1a1a25] lg:h-[47px]`}
    >
      <div
        onClick={() => setOpenLangMenu(!openLangMenu)}
        className="relative m-1 flex items-center gap-2 rounded-md bg-[#222339] px-3 py-2 lg:py-3"
      >
        <MdLanguage />
        <IoIosArrowDown />
        {openLangMenu && <LangMenu setOpenLangMenu={setOpenLangMenu} />}
      </div>
      <div className="flex items-center gap-[6px] gap-x-2 overflow-x-auto py-1 pl-2 scrollbar max-lg:scrollbar-thin lg:[&::-webkit-scrollbar-thumb]:bg-[#79b6fc] lg:[&::-webkit-scrollbar-track]:bg-[#5e5d5dee] lg:[&::-webkit-scrollbar]:h-[2px]">
        {status === "pending" && <LiveStatsSkeleton />}

        {error && (
          <div className="flex w-full items-center justify-center gap-x-3 py-1 text-xs font-bold tracking-wide text-red-400">
            <FaExclamationCircle className="text-lg" />
            {error.message === "Network Error" ? "Network Error" : error.response?.data.error}
          </div>
        )}

        {status === "success" &&
          users?.map((user) => {
            const { _id, name, points, emailVerified } = user;
            const isOnline = onlineUsers.includes(_id);
            const heighestUser = userHieghestPoints === _id;
            return (
              <Link
                key={_id}
                to={currentUser?._id === _id ? "/myprofile" : `/user/${_id}`}
                className="relative flex h-[30px] min-w-[155px] items-center justify-between gap-1 rounded-sm bg-[#222339] px-1 text-sm text-gray-400 lg:h-[37px] lg:min-w-[190px] lg:px-2"
              >
                {heighestUser && (
                  <span className="absolute -left-2 -top-2 h-5 w-5 -rotate-45">
                    <img src={crown} alt="" />
                  </span>
                )}
                <div className="h-[20px] w-[25px] lg:h-[27px] lg:w-[33px]">
                  <UserImage user={user} />
                </div>
                <div className="flex flex-col">
                  <span className="-mb-2 w-[80px] overflow-hidden truncate text-[9px] font-[400] tracking-wide text-[#dddbdb] sm:tracking-wider lg:-mb-1 lg:text-[11px] lg:font-bold">
                    {name}
                  </span>
                  <div className="flex items-center gap-8">
                    {isOnline && (
                      <span className="text-[9px] font-bold tracking-wide text-[#68e44a] lg:text-[11px]">
                        online
                      </span>
                    )}
                    {!isOnline && (
                      <span className="text-[9px] font-bold tracking-wide text-[#54724c] lg:text-[11px]">
                        offline
                      </span>
                    )}
                    {emailVerified && (
                      <img
                        src={verifiedImage}
                        alt=""
                        className="-mt-[2px] h-3 w-3 object-contain lg:h-4 lg:w-4"
                      />
                    )}
                  </div>
                </div>
                <span className="flex h-6 min-w-9 items-center justify-center rounded-md bg-[#181616] px-1 text-xs text-[#c1f018] lg:h-7">
                  {points}
                </span>
              </Link>
            );
          })}
        {isFetchNextPageError && (
          <button className="h-[45px] text-nowrap rounded-sm px-4 text-sm text-red-400 lg:h-[30px] lg:text-base">
            an error occurred
          </button>
        )}
        {hasNextPage && (
          <button
            className="h-[30px] text-nowrap rounded-sm bg-[#393957] px-4 text-sm lg:h-[40px] lg:text-base"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {!isFetchingNextPage && "Load more"}
            {isFetchingNextPage && <Spinner className="mx-4 h-4 w-4 border-2 lg:border-4" />}
          </button>
        )}
      </div>
    </div>
  );
});

export default LiveStats;
