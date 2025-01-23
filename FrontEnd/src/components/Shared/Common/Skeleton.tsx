import { cn } from "../../../utils/common";

const Skeleton = ({ className }: { className: string }) => {
  return (
    <div
      className={cn("skeleton-box relative animate-pulse overflow-hidden rounded-md bg-[#3f4055]", className)}
    ></div>
  );
};

export default Skeleton;
