import Skeleton from "../Others/Skeleton";

const SearchSkeleton = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-1 xs:gap-0 p-3 xs:p-1">
      <Skeleton className="w-[50%] h-6 xs:h-4" />
      <div className="w-full">
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <div className="w-full">
            <Skeleton className="w-[20%] h-2 xs:h-1 rounded-sm mb-1" />
            <Skeleton className="w-[40%] h-2 xs:h-1 rounded-sm" />
          </div>
        </div>
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <div className="w-full">
            <Skeleton className="w-[15%] h-2 xs:h-1 rounded-sm mb-1" />
            <Skeleton className="w-[50%] h-2 xs:h-1 rounded-sm" />
          </div>
        </div>
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <div className="w-full">
            <Skeleton className="w-[40%] h-2 xs:h-1 rounded-sm mb-1" />
            <Skeleton className="w-[20%] h-2 xs:h-1 rounded-sm" />
          </div>
        </div>
      </div>
      <Skeleton className="w-[50%] h-6 xs:h-4" />
      <div className="w-full">
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <div className="w-full">
            <Skeleton className="w-[30%] h-2 xs:h-1 rounded-sm mb-1" />
            <Skeleton className="w-[45%] h-2 xs:h-1 rounded-sm" />
          </div>
        </div>
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <div className="w-full">
            <Skeleton className="w-[20%] h-2 xs:h-1 rounded-sm mb-1" />
            <Skeleton className="w-[40%] h-2 xs:h-1 rounded-sm" />
          </div>
        </div>
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <div className="w-full">
            <Skeleton className="w-[28%] h-2 xs:h-1 rounded-sm mb-1" />
            <Skeleton className="w-[25%] h-2 xs:h-1 rounded-sm" />
          </div>
        </div>
      </div>
      <Skeleton className="w-[50%] h-6 xs:h-4" />
      <div className="w-full">
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <div className="w-full">
            <Skeleton className="w-[25%] h-2 xs:h-1 rounded-sm mb-1" />
            <Skeleton className="w-[35%] h-2 xs:h-1 rounded-sm" />
          </div>
        </div>
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <div className="w-full">
            <Skeleton className="w-[15%] h-2 xs:h-1 rounded-sm mb-1" />
            <Skeleton className="w-[30%] h-2 xs:h-1 rounded-sm" />
          </div>
        </div>
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <div className="w-full">
            <Skeleton className="w-[20%] h-2 xs:h-1 rounded-sm mb-1" />
            <Skeleton className="w-[40%] h-2 xs:h-1 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSkeleton;
