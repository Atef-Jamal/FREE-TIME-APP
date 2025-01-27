import { memo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../context/hooks";
import { resetPopup } from "../../../context/appStateSlice";
import { BiErrorAlt } from "react-icons/bi";
import { IoLockClosed } from "react-icons/io5";
import Spinner from "./Spinner";
import { FaRegCheckCircle } from "react-icons/fa";
import { cn } from "../../../utilities";

const ToastNotify = memo(() => {
  const ToastNotify = useAppSelector((state) => state.appState.ToastNotify);
  const { type, message } = ToastNotify;

  const dispatch = useAppDispatch();
  const textNoWrap = message && message.length <= 45 ? "text-nowrap" : "";

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
      className={cn(
        "fixed left-[50%] top-2 z-[100] mx-2 -translate-x-[50%] items-center justify-center gap-x-2 rounded-md border border-[#e0d975] bg-[#776ae7f8] px-2 py-1 transition duration-200 ease-linear md:py-2",
        message ? "flex" : "hidden",
        !textNoWrap && "mx-auto w-[95%] sm:w-auto",
      )}
    >
      <span className="text-xl">
        {type === "ERROR_LOCK" && <IoLockClosed />}
        {type === "ERROR_GENERAL" && <BiErrorAlt />}
        {type === "LOADING" && <Spinner className="border-[4px]" />}
        {type === "SUCESS" && <FaRegCheckCircle />}
      </span>
      <p className={cn("text-xs md:text-sm", textNoWrap)}>{message}</p>
    </div>
  );
});

export default ToastNotify;
