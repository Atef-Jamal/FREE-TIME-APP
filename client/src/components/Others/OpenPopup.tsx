import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import Spinner from "../Others/Spinner";
import { resetPopup } from "../../context/StateManeger";

const OpenPopup = () => {
  const { openPopup } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (openPopup.spinner !== true) {
      const timeOut = setTimeout(() => {
        dispatch(resetPopup());
      }, 5000);
      return () => clearTimeout(timeOut);
    }
  }, [openPopup]);

  return (
    <div
      className={`transition duration-500 ease-linear border border-[#97f34cde]  ${
        openPopup.status ? "opacity-100 py-2 " : " opacity-0 border-0"
      } fixed top-9 sm:top-2 z-[100] sm:left-[8%] lg:left-[22%] left-[38%] sm:w-[80%]  bg-[#7768fff8] rounded-md flex items-center  gap-4 px-4`}
    >
      {openPopup.icon ? <div>{openPopup.icon}</div> : undefined}
      {openPopup.spinner === true ? <Spinner className="w-4 h-4" /> : undefined}
      <p className="text-sm font-[500] tracking-wider text-[#f7ffe6]">
        {openPopup.message}
      </p>
    </div>
  );
};

export default OpenPopup;
