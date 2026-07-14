import Skeleton from "../../../../components/Shared/Skeleton";

const MessageSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-y-[6px] rounded-md bg-[#2f2f4e88] p-1">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-7 rounded-lg" />
        <div>
          <Skeleton className="mb-[3px] h-[7px] w-20 rounded-sm" />
          <Skeleton className="h-[6px] w-10 rounded-sm" />
        </div>
      </div>
      <div className="w-full">
        <Skeleton className="mb-[2px] h-[6px] w-[60%] rounded-sm" />
        <Skeleton className="mb-[2px] h-[6px] w-[50%] rounded-sm" />
        <Skeleton className="h-[6px] w-[70%] rounded-sm" />
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <Skeleton className="h-4 w-6 rounded-sm" />
        <Skeleton className="h-4 w-6 rounded-sm" />
        <Skeleton className="h-4 w-6 rounded-sm" />
      </div>
    </div>
  );
};

export default MessageSkeleton;
