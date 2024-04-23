import Skeleton from "../Others/Skeleton";

export const OtherUserProfileSkeleton = () => {
  return (
    <div className="mx-8 sm:mx-3 flex flex-col items-center gap-9 p-2">
      <Skeleton className="w-44 h-8 mr-auto mt-8" />
      <hr className="w-full" />
      <div className="flex items-center gap-4 w-full">
        <div className=" py-6 px-16 w-full flex items-center justify-between bg-[#1f182bb4] rounded-lg">
          <Skeleton className="w-[100px] h-[100px] rounded-full " />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="w-60 h-4" />
            <Skeleton className="w-60 h-4" />
            <Skeleton className="w-60 h-4" />
          </div>
        </div>
        <div className=" py-4 px-16 w-full flex flex-col items-center gap-3 bg-[#1f182bb4] rounded-lg">
          <Skeleton className="w-44 h-6 " />
          <div className="flex w-full items-center justify-between px-9">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-[200px] h-8 " />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-[200px] h-8 " />
            </div>
          </div>
          <div className="flex w-full items-center justify-between px-9">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-[200px] h-8 " />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-[200px] h-8 " />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-8 w-full">
        <Skeleton className="w-44 h-5" />
        <div className="flex flex-col items-center gap-5 w-full">
          <Skeleton className="w-full h-9" />
          <Skeleton className="w-full h-9" />
          <Skeleton className="w-full h-9" />
          <Skeleton className="w-full h-9" />
          <Skeleton className="w-full h-9" />
          <Skeleton className="w-full h-9" />
          <Skeleton className="w-full h-9" />
          <Skeleton className="w-full h-9" />
        </div>
      </div>
    </div>
  );
};
