import Skeleton from "../../Others/Skeleton";

const PeopleSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-y-2 p-2 bg-[#27273afb] rounded-md">
      <div className="flex items-center gap-2">
        <Skeleton className="w-7 h-6 rounded-lg" />
        <div>
          <Skeleton className="w-20 h-[7px] mb-[3px] rounded-sm" />
          <Skeleton className="w-10 h-[6px] rounded-sm" />
        </div>
      </div>
      <div className="w-full">
        <Skeleton className="w-[60%] h-[6px] rounded-sm mb-[2px]" />
        <Skeleton className="w-[50%] h-[6px] rounded-sm mb-[2px]" />
        <Skeleton className="w-[70%] h-[6px] rounded-sm" />
      </div>
    </div>
  );
};

export default PeopleSkeleton;
