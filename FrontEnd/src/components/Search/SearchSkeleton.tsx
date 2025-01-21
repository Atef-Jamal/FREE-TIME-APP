import Skeleton from "../Others/Skeleton";

const SearchSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-1 p-1 lg:p-3">
      <Skeleton className="h-4 w-[50%] md:h-6" />
      <div className="w-full">
        <div className="mb-1 flex w-full items-center gap-2 md:gap-3">
          <Skeleton className="h-6 w-7 rounded-full md:h-8 md:w-9" />
          <div className="w-full">
            <Skeleton className="mb-1 h-2 w-[20%] rounded-sm" />
            <Skeleton className="h-2 w-[40%] rounded-sm" />
          </div>
        </div>
        <div className="mb-1 flex w-full items-center gap-2 md:gap-3">
          <Skeleton className="h-6 w-7 rounded-full md:h-8 md:w-9" />
          <div className="w-full">
            <Skeleton className="mb-1 h-2 w-[15%] rounded-sm" />
            <Skeleton className="h-2 w-[50%] rounded-sm" />
          </div>
        </div>
        <div className="mb-1 flex w-full items-center gap-2 md:gap-3">
          <Skeleton className="h-6 w-7 rounded-full md:h-8 md:w-9" />
          <div className="w-full">
            <Skeleton className="mb-1 h-2 w-[40%] rounded-sm" />
            <Skeleton className="h-2 w-[20%] rounded-sm" />
          </div>
        </div>
      </div>
      <Skeleton className="h-4 w-[50%] md:h-6" />
      <div className="w-full">
        <div className="mb-1 flex w-full items-center gap-2 md:gap-3">
          <Skeleton className="h-6 w-7 rounded-full md:h-8 md:w-9" />
          <div className="w-full">
            <Skeleton className="mb-1 h-2 w-[30%] rounded-sm" />
            <Skeleton className="h-2 w-[45%] rounded-sm" />
          </div>
        </div>
        <div className="mb-1 flex w-full items-center gap-2 md:gap-3">
          <Skeleton className="h-6 w-7 rounded-full md:h-8 md:w-9" />
          <div className="w-full">
            <Skeleton className="mb-1 h-2 w-[20%] rounded-sm" />
            <Skeleton className="h-2 w-[40%] rounded-sm" />
          </div>
        </div>
        <div className="mb-1 flex w-full items-center gap-2 md:gap-3">
          <Skeleton className="h-6 w-7 rounded-full md:h-8 md:w-9" />
          <div className="w-full">
            <Skeleton className="mb-1 h-2 w-[28%] rounded-sm" />
            <Skeleton className="h-2 w-[25%] rounded-sm" />
          </div>
        </div>
      </div>
      <Skeleton className="h-4 w-[50%] md:h-6" />
      <div className="w-full">
        <div className="mb-1 flex w-full items-center gap-2 md:gap-3">
          <Skeleton className="h-6 w-7 rounded-full md:h-8 md:w-9" />
          <div className="w-full">
            <Skeleton className="mb-1 h-2 w-[25%] rounded-sm" />
            <Skeleton className="h-2 w-[35%] rounded-sm" />
          </div>
        </div>
        <div className="mb-1 flex w-full items-center gap-3 sm:gap-2">
          <Skeleton className="h-6 w-7 rounded-full md:h-8 md:w-9" />
          <div className="w-full">
            <Skeleton className="mb-1 h-2 w-[15%] rounded-sm" />
            <Skeleton className="h-2 w-[30%] rounded-sm" />
          </div>
        </div>
        <div className="mb-1 flex w-full items-center gap-2 md:gap-3">
          <Skeleton className="mx-auto h-6 w-7 rounded-full md:h-8 md:w-9" />
          <div className="w-full">
            <Skeleton className="mb-1 h-2 w-[20%] rounded-sm" />
            <Skeleton className="h-2 w-[40%] rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSkeleton;
