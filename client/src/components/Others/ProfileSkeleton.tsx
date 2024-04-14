import { lazy } from "react";

const Skeleton = lazy(() => import("../Others/Skeleton"))

const ProfileSkeleton = () => {
  return (
    <div className="flex item-center gap-2 sm:gap-1">
      <div className="flex items-center gap-1 bg-[#2f3043] p-3 sm:p-2 rounded-md">
        <Skeleton className="w-[20px] h-[20px]" />
      </div>
      <div className="flex items-center gap-2 bg-[#2f3043] h-[50px] sm:h-[40px] px-3 sm:px-2 rounded-md">
        <Skeleton className="w-[30px] h-[30px] rounded-lg" />
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="w-[170px] xs:w-[100px] h-[8px]" />
          <Skeleton className="w-[170px] xs:w-[100px] h-[8px]" />
        </div>
      </div>
      <div className="flex items-center gap-1 bg-[#2f3043] p-3 sm:p-2 rounded-md">
        <Skeleton className="w-[20px] h-[20px]" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
