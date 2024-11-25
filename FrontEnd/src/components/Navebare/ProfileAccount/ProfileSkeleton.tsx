import Skeleton from "../../others/Skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="h-full flex items-center gap-2 sm:gap-1">
      <div className="h-full flex items-center gap-1 bg-[#2f3043] p-3 sm:p-2 rounded-md">
        <Skeleton className="w-[25px] h-[25px]" />
      </div>
      <div className="h-full flex items-center gap-2 bg-[#2f3043] rounded-md p-2">
        <Skeleton className="w-[30px] h-[30px] rounded-lg" />
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="w-[170px] xs:w-[100px] h-[8px]" />
          <Skeleton className="w-[170px] xs:w-[100px] h-[8px]" />
        </div>
      </div>
      <div className="flex h-full items-center gap-1 bg-[#2f3043] p-3 sm:p-2 rounded-md">
        <Skeleton className="w-[25px] h-[25px]" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
