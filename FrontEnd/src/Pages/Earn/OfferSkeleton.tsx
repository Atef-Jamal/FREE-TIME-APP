import Skeleton from "../../components/Shared/Common/Skeleton";

const OfferSkeleton = () => (
  <div className="flex h-[250px] flex-col items-center justify-between rounded-md border border-gray-700 bg-[#2a244481] p-3">
    <Skeleton className="h-[120px] w-full" />
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-[13px] w-[60%]" />
        <Skeleton className="h-[13px] w-[35%]" />
      </div>
      <Skeleton className="h-[18px] w-full" />
    </div>
    <div className="flex w-full flex-col items-center gap-1">
      <Skeleton className="h-[12px] w-full" />
    </div>
    <div className="flex w-full items-center justify-between">
      <Skeleton className="h-[22px] w-[35%]" />
      <Skeleton className="h-[22px] w-[60%]" />
    </div>
  </div>
);

export default OfferSkeleton;
