import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { resetPopup } from "../../context/StateManeger";

const OpenPopup = () => {
  const { openPopup } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (openPopup.status === true) {
      const timeOut = setTimeout(() => {
        dispatch(resetPopup());
      }, 5000);
      return () => clearTimeout(timeOut);
    }
  }, [openPopup]);

  return (
    <div
      className={`${
        openPopup.status ? "opacity-100" : " opacity-0 border-none"
      } transition duration-500 ease-linear w-fit flex items-center gap-3 xs:gap-2 bg-[#7768fff8] rounded-lg border px-4 sm:px-2 py-2 sm:py-1 mx-auto border-[#97f34cde] `}
    >
      <span className="text-xl">{openPopup.icon}</span>
      <p className="sm:text-sm text-md font-[500] tracking-wider text-[#f7ffe6]">
        {openPopup.message}
      </p>
    </div>
  );
};

export default OpenPopup;
