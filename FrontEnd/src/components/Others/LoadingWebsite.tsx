import Spinner from "./Spinner";

const LoadingWebsite = ({ className }: { className?: string }) => {
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
    >
      <Spinner className="w-28 h-28 sm:w-20 sm:h-20 sm:border-[4px] border-[7px] border-b-yellow-500 border-l-yellow-500 mx-auto " />
    </div>
  );
};

export default LoadingWebsite;
