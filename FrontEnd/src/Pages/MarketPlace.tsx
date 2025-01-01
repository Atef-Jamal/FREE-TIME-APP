import { MdStorefront } from "react-icons/md";
import { useAppSelector } from "../context/Hooks";
import FrameItem from "../components/MarketPlace/FrameItem";
import { fetchAllFrames } from "../utils";
import { useScrollToElement } from "../hooks";
import { useQuery } from "@tanstack/react-query";

const MarketPlace = () => {
  const resizeSidebare = useAppSelector((state) => state.stateManeger.resizeSidebare);

  const {
    data: frames = [],
    status,
    error,
  } = useQuery({
    queryKey: ["frames"],
    queryFn: fetchAllFrames,
    staleTime: 60 * 60 * 1000,
  });

  useScrollToElement({ dependencies: [frames] });

  return (
    <div className="min-h-screen p-5 sm:p-3 w-full">
      <h1 className="border-b text-3xl text-[#7cec50] w-[40%] lg:w-[70%] py-2 mb-6 lg:text-xl font-bold flex items-center gap-5 lg:gap-3">
        <MdStorefront /> MARKET STORE
      </h1>
      {status === "error" && <p>{error.response?.data.error}</p>}
      {status === "pending" && <div className="text-center my-10">Loading</div>}
      <div
        className={`${
          resizeSidebare
            ? "grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2"
            : "grid-cols-7 xl:grid-cols-5 lg:grid-cols-3 xs:grid-cols-2"
        } w-full grid gap-4 sm:gap-2 `}
      >
        {frames.map((item) => {
          return <FrameItem key={item._id} singleFrame={item} />;
        })}
      </div>
    </div>
  );
};

export default MarketPlace;
