import Skeleton from "../Others/Skeleton";

const DailyStreakRewardCardSkeleton = () => {
  return (
    <div className="p-2 flex flex-col items-center justify-center gap-3 bg-[#122641c4] rounded-md">
      <div className="w-full flex items-center justify-center gap-2">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <div className="w-full">
        <Skeleton className="h-4 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
};

export default DailyStreakRewardCardSkeleton;
