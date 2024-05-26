import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { resetPopup } from "../../context/StateManeger";
import { BiErrorAlt } from "react-icons/bi";
import { IoLockClosed } from "react-icons/io5";
import Spinner from "./Spinner";
import { FaRegCheckCircle } from "react-icons/fa";

const OpenPopup = () => {
  const {
    openPopup: { status, type, message },
  } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === true) {
      const timeOut = setTimeout(() => {
        dispatch(resetPopup());
      }, 5000);
      return () => clearTimeout(timeOut);
    }
  }, [status]);

  return (
    <div
      className={`${
        status ? " translate-y-0" : "-translate-y-[200%]"
      } transition duration-200 ease-linear w-fit flex items-center gap-3 xs:gap-2 bg-[#7768fff8] rounded-lg border px-4 sm:px-2 py-2 mx-auto border-[#97f34cde] `}
    >
      <span className="text-xl">
        {type === "ERROR_LOCK" && <IoLockClosed />}
        {type === "ERROR_GENERAL" && <BiErrorAlt />}
        {type === "LOADING" && <Spinner className="w-6 h-6" />}
        {type === "SUCESS" && <FaRegCheckCircle />}
      </span>
      <p className="sm:text-sm text-md font-[500] tracking-wider text-[#f7ffe6]">
        {message} hellow
      </p>
    </div>
  );
};

export default OpenPopup;
