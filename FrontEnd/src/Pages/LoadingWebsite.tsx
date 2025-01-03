const LoadingWebsite = ({ className }: { className?: string }) => {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <div className="border rounded-md border-gray-500 p-1 flex items-center justify-center -skew-x-[20deg] relative overflow-hidden">
        <div className="z-[1] p-2 bg-[#22162c]  flex items-center text-6xl sm:text-3xl font-extrabold border border-gray-500  ">
          <span className="text-green-400">FREE</span>
          <span className="text-gray-300">TIME</span>
        </div>
        <span className="loadingAnimation absolute z-[0] bg-[#78d8f0] h-[700%] w-8"></span>
      </div>
    </div>
  );
};

export default LoadingWebsite;
