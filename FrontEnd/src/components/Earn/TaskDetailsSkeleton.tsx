import Skeleton from "../Others/Skeleton";

const AppDetailsSkeleton = () => {
  return (
    <>
      <Skeleton className="mb-4 h-5 w-[40%]" />
      <Skeleton className="mb-4 h-[300px] w-full rounded-lg" />
      <Skeleton className="mb-3 h-4 w-full" />
      <Skeleton className="mb-3 h-6 w-full" />
      <Skeleton className="mb-3 h-4 w-full" />
      <Skeleton className="mb-3 h-10 w-full" />
    </>
  );
};

export default AppDetailsSkeleton;
