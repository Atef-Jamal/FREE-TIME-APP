import Skeleton from "./Skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="flex h-full items-center gap-1 sm:gap-2">
      <div className="flex h-full items-center gap-1 rounded-md bg-[#2f3043] p-2 sm:p-3">
        <Skeleton className="h-[25px] w-[25px]" />
      </div>
      <div className="flex h-full items-center gap-2 rounded-md bg-[#2f3043] p-2">
        <Skeleton className="h-[25px] w-[25px] rounded-lg" />
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-[8px] w-[100px] sm:w-[170px]" />
          <Skeleton className="h-[8px] w-[100px] sm:w-[170px]" />
        </div>
      </div>
      <div className="flex h-full items-center gap-1 rounded-md bg-[#2f3043] p-2 sm:p-3">
        <Skeleton className="h-[25px] w-[25px] rounded-md" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
