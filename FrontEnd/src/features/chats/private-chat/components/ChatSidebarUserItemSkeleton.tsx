import Skeleton from "../../../../components/Shared/Skeleton";

const ChatSidebarUserItemSkeleton = () => {
  return (
    <div className="mb-1 flex w-full flex-col gap-y-2 rounded-md bg-[#252536fb] p-2">
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
    </div>
  );
};

export default ChatSidebarUserItemSkeleton;
