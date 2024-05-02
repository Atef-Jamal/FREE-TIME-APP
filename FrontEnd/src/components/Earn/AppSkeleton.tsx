import Skeleton from "../Others/Skeleton";

const AppSkeleton = () => (
  <div className="h-[250px] p-3 rounded-md flex flex-col items-center justify-between bg-[#2a244481] border border-gray-700">
    <Skeleton className="h-[120px] w-full" />
    <div className="w-full flex flex-col gap-1 ">
      <div className="w-full flex items-center justify-between">
        <Skeleton className="w-[60%] h-[13px] " />
        <Skeleton className="w-[35%] h-[13px] " />
      </div>
      <Skeleton className="w-full h-[18px]" />
    </div>
    <div className="w-full flex flex-col items-center gap-1">
      <Skeleton className="h-[12px] w-full" />
    </div>
    <div className="w-full flex items-center justify-between">
      <Skeleton className="w-[35%] h-[22px]" />
      <Skeleton className="w-[60%] h-[22px]" />
    </div>
  </div>
);

export default AppSkeleton;
