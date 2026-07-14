import { cn } from "../utils";

const LoadingPage = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex h-full w-full items-center justify-center", className)}>
      <div className="relative flex -skew-x-[20deg] items-center justify-center overflow-hidden rounded-md border border-gray-500 p-1">
        <div className="z-[1] flex items-center border border-gray-500 bg-[#22162c] p-2 text-3xl font-extrabold lg:text-6xl">
          <span className="text-green-400">FREE</span>
          <span className="text-gray-300">TIME</span>
        </div>
        <span className="loadingAnimation absolute z-[0] h-[700%] w-8 bg-[#78d8f0]"></span>
      </div>
    </div>
  );
};

export default LoadingPage;
