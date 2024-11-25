import Skeleton from "../others/Skeleton";

const LiveStatsSkeleton = () => {
  return (
    <>
      {[...Array(20).keys()].map((item) => (
        <div
          key={item}
          className="flex items-center gap-2 bg-[#222339] px-3 py-2 sm:py-[6px] rounded-sm"
        >
          <Skeleton className="h-7 w-7 sm:h-5 xs:w-5" />
          <div className="flex flex-col gap-[6px] xs:gap-1 h-full">
            <Skeleton className="h-[5px] sm:h-[4px] w-[110px] rounded-sm" />
            <Skeleton className="h-[5px] sm:h-[4px] w-[85px] rounded-sm" />
          </div>
        </div>
      ))}
    </>
  );
};

export default LiveStatsSkeleton;
