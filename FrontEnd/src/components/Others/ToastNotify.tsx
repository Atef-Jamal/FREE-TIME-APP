import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { resetPopup } from "../../context/StateManeger";
import { BiErrorAlt } from "react-icons/bi";
import { IoLockClosed } from "react-icons/io5";
import Spinner from "./Spinner";
import { FaRegCheckCircle } from "react-icons/fa";

const ToastNotify = () => {
  const { ToastNotify } = useAppSelector((state) => state.stateManeger);
  const { type, message } = ToastNotify;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!message) return;
    const timeOutId = setTimeout(
      () => {
        dispatch(resetPopup());
      },
      type === "LOADING" ? 15000 : 5000
    );

    return () => clearTimeout(timeOutId);
  }, [type, message, dispatch]);

  return (
    <div
      className={`absolute top-3 sm:top-1 z-[20] ${
        message
          ? " translate-y-0 p-2 border  border-[#e0d975]"
          : "-translate-y-[150%] p-0"
      } transition duration-200 ease-linear w-fit flex items-center gap-3 xs:gap-2 bg-[#776ae7f8] rounded-lg `}
    >
      <span className="text-xl">
        {type === "ERROR_LOCK" && <IoLockClosed />}
        {type === "ERROR_GENERAL" && <BiErrorAlt />}
        {type === "LOADING" && <Spinner className="w-6 h-6 border-[4px]" />}
        {type === "SUCESS" && <FaRegCheckCircle />}
      </span>
      <p className="sm:text-sm text-md font-[500] tracking-wider text-[#f7ffe6]">
        {message}
      </p>
    </div>
  );
};

export default ToastNotify;
