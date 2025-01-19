import { memo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { resetPopup } from "../../context/StateManeger";
import { BiErrorAlt } from "react-icons/bi";
import { IoLockClosed } from "react-icons/io5";
import Spinner from "./Spinner";
import { FaRegCheckCircle } from "react-icons/fa";
import { cn } from "../../utils/common";

const ToastNotify = memo(() => {
  const ToastNotify = useAppSelector((state) => state.stateManeger.ToastNotify);
  const { type, message } = ToastNotify;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!message) return;
    const timeOutId = setTimeout(
      () => {
        dispatch(resetPopup());
      },
      type === "LOADING" ? 15000 : 5000,
    );

    return () => clearTimeout(timeOutId);
  }, [type, message, dispatch]);

  return (
    <div
      // className={`absolute top-1 z-[50] md:top-3 ${
      //   message ? "translate-y-0 border border-[#e0d975] p-2" : "-translate-y-[150%] p-0"
      // } xs:gap-2 flex w-fit items-center gap-3 rounded-lg bg-[#776ae7f8] transition duration-200 ease-linear`}
      className={cn(
        "absolute left-[50%] top-2 z-[50] min-w-fit max-w-[90%] -translate-x-[50%] items-center justify-center gap-x-2 rounded-lg border border-[#e0d975] bg-[#776ae7f8] px-2 py-1 transition duration-200 ease-linear md:top-4 md:px-4 md:py-2",
        message ? "flex" : "hidden",
      )}
    >
      <span className="text-xl">
        {type === "ERROR_LOCK" && <IoLockClosed />}
        {type === "ERROR_GENERAL" && <BiErrorAlt />}
        {type === "LOADING" && <Spinner className="h-6 w-6 border-[4px]" />}
        {type === "SUCESS" && <FaRegCheckCircle />}
      </span>
      <p className="text-xs md:text-sm">{message}</p>
    </div>
  );
});

export default ToastNotify;
