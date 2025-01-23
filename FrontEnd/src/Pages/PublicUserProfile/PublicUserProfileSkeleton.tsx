import Skeleton from "../../components/Shared/Common/Skeleton";

export const PublicUserProfileSkeleton = () => {
  return (
    <div className="bg-transparent py-5 lg:pt-8">
      <div className="mx-auto w-[95%] space-y-5 lg:space-y-10">
        <Skeleton className="h-4 w-28" />
        <div className="flex flex-col gap-[2%] md:flex-row">
          <div className="flex items-center justify-evenly rounded-lg bg-[#1d1d2e] py-5 md:w-[49%]">
            <Skeleton className="h-[80px] w-[90px] md:h-[80px] md:w-[100px] lg:h-[90px] lg:w-[110px]" />
            <div className="space-y-2">
              <Skeleton className="h-2 w-20" />
              <Skeleton className="h-2 w-16" />
              <Skeleton className="h-2 w-40" />
            </div>
          </div>
          <div className="px-1 py-2 sm:px-3 md:w-[49%]">
            <Skeleton className="mb-3 h-4 w-24" />
            <div className="grid grid-cols-2 gap-y-3">
              <div className="flex items-center gap-x-1 sm:gap-x-2">
                <Skeleton className="h-6 w-6" />
                <div className="space-y-1">
                  <Skeleton className="h-2 w-4" />
                  <Skeleton className="h-2 w-28" />
                </div>
              </div>
              <div className="flex items-center gap-x-1 sm:gap-x-2">
                <Skeleton className="h-6 w-6" />
                <div className="space-y-1">
                  <Skeleton className="h-2 w-4" />
                  <Skeleton className="h-2 w-28" />
                </div>
              </div>
              <div className="flex items-center gap-x-1 sm:gap-x-2">
                <Skeleton className="h-6 w-6" />
                <div className="space-y-1">
                  <Skeleton className="h-2 w-4" />
                  <Skeleton className="h-2 w-28" />
                </div>
              </div>
              <div className="flex items-center gap-x-1 sm:gap-x-2">
                <Skeleton className="h-6 w-6" />
                <div className="space-y-1">
                  <Skeleton className="h-2 w-4" />
                  <Skeleton className="h-2 w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3 w-24" />
        <div className="w-full">
          <div className="mb-2 flex h-[40px] items-center justify-between border-b p-1 text-sm lg:text-base">
            <span className="flex-1 font-bold text-gray-300">Offer</span>
            <span className="px-2 text-center font-bold text-gray-300 md:w-[10%]">Time</span>
            <span className="px-2 text-center font-bold text-gray-300 md:w-[10%]">Points</span>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-[30px] lg:h-[35px]" />
            <Skeleton className="h-[30px] lg:h-[35px]" />
            <Skeleton className="h-[30px] lg:h-[35px]" />
            <Skeleton className="h-[30px] lg:h-[35px]" />
            <Skeleton className="h-[30px] lg:h-[35px]" />
            <Skeleton className="h-[30px] lg:h-[35px]" />
            <Skeleton className="h-[30px] lg:h-[35px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
