import { memo, Suspense, useMemo, useState } from "react";
import { MdLanguage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FaExclamationCircle } from "react-icons/fa";
import LiveStatsItem from "../../features/live-stats/components/LiveStatsItem";
import LangMenu from "../../features/live-stats/components/LangMenu";
import LiveStatsSkeleton from "../../features/live-stats/components/LiveStatsSkeleton";
import Spinner from "../../components/Shared/Spinner";
import { useInfiniteLiveStatsUsers } from "../../features/live-stats/hooks";
import { useFetchTopUser } from "../../features/user/hooks";

const LiveStats = memo(() => {
  const [openLangMenu, setOpenLangMenu] = useState(false);

  const { data, status, error, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError } =
    useInfiniteLiveStatsUsers();

  const { data: topUser } = useFetchTopUser();

  const users = data?.pages.map((page) => page.users).flat();

  const memomizedUsersList = useMemo(() => {
    return users?.map((user) => {
      return <LiveStatsItem key={user._id} user={user} topUserId={topUser?.userId} />;
    });
  }, [users, topUser?.userId]);

  return (
    <div
      className={
        "sticky top-[55px] z-[4] flex h-[40px] items-center border-b border-[#ffd7d728] bg-[#1a1a25] lg:h-[47px]"
      }
    >
      <div className="sticky left-0 z-[1] flex h-full items-center justify-center bg-[#1a1a25] px-1">
        <div
          onClick={() => setOpenLangMenu(!openLangMenu)}
          className="flex h-[35px] items-center gap-x-2 rounded-md bg-[#33334d] px-1 lg:h-[38px]"
        >
          <MdLanguage />
          <IoIosArrowDown />
        </div>
        {openLangMenu && <Suspense children={<LangMenu setOpenLangMenu={setOpenLangMenu} />} />}
      </div>
      <div className="scrollbar-custom-livestats flex h-full items-center gap-x-1 overflow-x-auto pl-2 max-lg:scrollbar-thin lg:gap-x-2">
        {status === "pending" && <LiveStatsSkeleton />}

        {error && (
          <div className="flex w-full items-center justify-center gap-x-3 py-1 text-xs font-bold tracking-wide text-red-400">
            <FaExclamationCircle className="text-lg" />
            {error.message === "Network Error" ? "Network Error" : error.response?.data.error}
          </div>
        )}

        {memomizedUsersList}

        {isFetchNextPageError && (
          <button className="h-[31px] text-nowrap rounded-sm px-4 text-sm text-red-400 lg:h-[38px] lg:text-base">
            an error occurred
          </button>
        )}

        {hasNextPage && (
          <button
            className="flex h-[31px] items-center justify-center text-nowrap rounded-sm bg-[#393957] px-4 text-sm lg:h-[38px] lg:text-base"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {!isFetchingNextPage && "Load more"}
            {isFetchingNextPage && <Spinner />}
          </button>
        )}
      </div>
    </div>
  );
});

export default LiveStats;
