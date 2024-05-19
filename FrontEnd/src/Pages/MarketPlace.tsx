import { useEffect, useState } from "react";
import { MdStorefront } from "react-icons/md";
import { showPopup } from "../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import FrameItem from "../components/MarketPlace/FrameItem";
import { makeRequest } from "../utils";
import { handleApiError } from "../utils/common";

import { TypeFrame } from "../types/frameTypes";
import { useScrollToElement } from "../hooks/commonHooks";

const MarketPlace = () => {
  const { resizeSidebare } = useAppSelector((state) => state.stateManeger);
  const [frames, setFrames] = useState<TypeFrame[]>([]);

  useScrollToElement([frames]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const getFrames = async () => {
      try {
        const response = await makeRequest.get("api/frames");
        setFrames(response.data);
      } catch (error) {
        dispatch(
          showPopup({
            status: true,
            message: handleApiError(error),
            type: "ERROR_GENERAL",
          })
        );
      }
    };
    getFrames();
  }, []);

  return (
    <div className="min-h-screen p-8 sm:p-4 w-full">
      <h1 className="border-b text-3xl text-[#7cec50] w-[40%] lg:w-[70%] py-5 mb-10 lg:text-xl font-bold flex items-center gap-5 lg:gap-3">
        <MdStorefront /> MARKET STORE
      </h1>
      <div
        className={`${
          resizeSidebare
            ? "grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2"
            : "grid-cols-7 xl:grid-cols-5 lg:grid-cols-3 xs:grid-cols-2"
        } w-full grid gap-4 sm:gap-2 `}
      >
        {frames?.map((item) => {
          return <FrameItem key={item._id} singleFrame={item} />;
        })}
      </div>
    </div>
  );
};

export default MarketPlace;
