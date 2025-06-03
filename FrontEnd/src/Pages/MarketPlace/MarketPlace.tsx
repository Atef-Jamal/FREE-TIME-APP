import { MdStorefront } from "react-icons/md";
import { useAppSelector } from "../../context/hooks";
import { useScrollToElement } from "../../hooks/useScrollToElement";
import { cn } from "../../utilities";
import FrameItem from "./FrameItem";
import { useFetchFrames } from "../../tanstackQuery/queryFetch";
import { selectSidebarCollapsed } from "../../context/appStateSlice";

const MarketPlace = () => {
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);

  const { data: frames = [], status, error } = useFetchFrames();

  useScrollToElement({ startScroll: status === "success" });

  return (
    <div className="min-h-screen w-full p-3 lg:p-5">
      <h1 className="mb-6 flex w-[70%] items-center gap-x-3 border-b py-2 text-xl font-bold text-[#7cec50] lg:w-[40%] lg:gap-x-5 lg:text-3xl">
        <MdStorefront /> MARKET STORE
      </h1>
      {status === "error" && <p>{error.response?.data.error}</p>}
      {status === "pending" && <div className="my-10 text-center">Loading</div>}
      <div
        className={cn(
          "grid w-full grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-4",
          sidebarCollapsed ? "lg:grid-cols-5 xl:grid-cols-6" : "lg:grid-cols-4 xl:grid-cols-5",
        )}
      >
        {frames.map((item) => {
          return <FrameItem key={item._id} singleFrame={item} />;
        })}
      </div>
    </div>
  );
};

export default MarketPlace;
