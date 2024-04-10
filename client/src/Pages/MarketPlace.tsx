import { useEffect, useState } from "react";
import { MdStorefront } from "react-icons/md";
import { BsExclamationOctagonFill } from "react-icons/bs";
import { showPopup } from "../context/StateManeger";
import { TypeFrame } from "../types";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import axios from "axios";
import FrameItem from "../components/MarketPlace/FrameItem";

const MarketPlace = () => {
  const { resizeSidebare, currentUser, currentUserIsLoading } = useAppSelector(
    (state) => state.stateManeger
  );
  const [frames, setFrames] = useState<TypeFrame[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const getFrames = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/frames");
        setFrames(response.data);
      } catch (err) {
        dispatch(
          showPopup({
            status: true,
            message: "Failed to Load frames, Check your Network",
            icon: <BsExclamationOctagonFill />,
          })
        );
      }
    };
    if (!currentUserIsLoading) {
      getFrames();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen p-8 sm:p-4 w-full">
      <h1 className="border-b text-3xl text-[#7cec50] w-[40%] lg:w-[70%] py-5 mb-10 lg:text-xl font-bold flex items-center gap-5 lg:gap-3">
        <MdStorefront /> MARKET STORE
      </h1>
      <div
        className={`w-full grid gap-4 sm:gap-2 ${
          resizeSidebare
            ? "grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-3 "
            : "grid-cols-7 xl:grid-cols-5 lg:grid-cols-3 xs:grid-cols-2"
        }`}
      >
        {frames?.map((item) => {
          return <FrameItem key={item._id} singleFrame={item} />;
        })}
      </div>
    </div>
  );
};

export default MarketPlace;
