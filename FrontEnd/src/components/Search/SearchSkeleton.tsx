import Skeleton from "../Others/Skeleton";

const SearchSkeleton = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 xs:gap-1 p-3 xs:p-1">
      <Skeleton className="w-[50%] h-6 xs:h-4" />
      <div className="w-full">
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <Skeleton className="w-[30%] h-3 xs:h-2 rounded-sm" />
        </div>
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <Skeleton className="w-[50%] h-3 xs:h-2 rounded-sm" />
        </div>
        <div className="w-full flex items-center gap-3">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <Skeleton className="w-[40%] h-3 xs:h-2 rounded-sm" />
        </div>
      </div>
      <Skeleton className="w-[50%] h-6 xs:h-4" />
      <div className="w-full">
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <Skeleton className="w-[30%] h-3 xs:h-2 rounded-sm" />
        </div>
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <Skeleton className="w-[50%] h-3 xs:h-2 rounded-sm" />
        </div>
        <div className="w-full flex items-center gap-3">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <Skeleton className="w-[40%] h-3 xs:h-2 rounded-sm" />
        </div>
      </div>
      <Skeleton className="w-[50%] h-6 xs:h-4" />
      <div className="w-full">
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <Skeleton className="w-[30%] h-3 xs:h-2 rounded-sm" />
        </div>
        <div className="w-full flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <Skeleton className="w-[50%] h-3 xs:h-2 rounded-sm" />
        </div>
        <div className="w-full flex items-center gap-3">
          <Skeleton className="w-8 h-8 sm:w-5 sm:h-5 rounded-full" />
          <Skeleton className="w-[40%] h-3 xs:h-2 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default SearchSkeleton;
