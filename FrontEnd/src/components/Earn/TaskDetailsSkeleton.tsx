import Skeleton from "../Others/Skeleton";

const AppDetailsSkeleton = () => {
  return (
    <>
      <Skeleton className="w-[40%] rounded-md h-5 mb-4" />
      <Skeleton className="w-full h-[300px] rounded-lg mb-4" />
      <Skeleton className="w-full rounded-md h-4 mb-3" />
      <Skeleton className="w-full rounded-md h-6 mb-3" />
      <Skeleton className="w-full rounded-md h-4 mb-3" />
      <Skeleton className="w-full rounded-md h-10 mb-3" />
    </>
  );
};

export default AppDetailsSkeleton;
