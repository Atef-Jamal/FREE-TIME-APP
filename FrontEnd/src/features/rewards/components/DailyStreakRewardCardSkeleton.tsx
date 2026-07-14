import Skeleton from "../../../components/Shared/Skeleton";

const DailyStreakRewardCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md bg-[#122641c4] p-2">
      <div className="flex w-full items-center justify-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="w-full">
        <Skeleton className="h-4 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
};

export default DailyStreakRewardCardSkeleton;
