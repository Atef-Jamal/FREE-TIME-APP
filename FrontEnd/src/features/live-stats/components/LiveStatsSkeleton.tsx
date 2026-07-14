import Skeleton from "../../../components/Shared/Skeleton";

const LiveStatsSkeleton = () => {
  return (
    <>
      {[...Array(20).keys()].map((item) => (
        <div
          key={item}
          className="flex h-[30px] items-center gap-x-2 rounded-sm bg-[#222339] px-3 lg:h-[37px]"
        >
          <Skeleton className="h-5 w-5 lg:h-7 lg:w-7" />
          <div className="space-y-[5px] lg:space-y-[7px]">
            <Skeleton className="h-[5px] w-[110px] rounded-sm lg:h-[6px]" />
            <Skeleton className="h-[5px] w-[85px] rounded-sm lg:h-[6px]" />
          </div>
        </div>
      ))}
    </>
  );
};

export default LiveStatsSkeleton;
