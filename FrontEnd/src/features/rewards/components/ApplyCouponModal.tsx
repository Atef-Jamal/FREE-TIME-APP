import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";
import { FaHandsHelping } from "react-icons/fa";
import { CgPushDown } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../context/hooks";
import { resetModel, setCurrentUser, openToast, selectCurrentUser } from "../../../context/appStateSlice";
import bonusImage from "../../../assets/images/Bonus-Code.png";
import { cn, handleApiError } from "../../../utils";
import Spinner from "../../../components/Shared/Spinner";
import { applyBonusCode } from "../services";

const ApplyCoupon = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [code, setCode] = useState<string>("");
  const [openHelp, setOpenHelp] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: applyBonusCode,
    onSuccess: (data) => {
      if (!currentUser) return;
      setCode("");
      dispatch(setCurrentUser({ ...currentUser, points: data.points }));
      dispatch(
        openToast({
          message: "successfully applied",
          type: "SUCESS",
        }),
      );
    },
    onError: (error) => {
      dispatch(
        openToast({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
      );
    },
  });

  const applyHandler = () => {
    if (!currentUser) return;
    if (code.trim() === "") {
      dispatch(
        openToast({
          message: "Enter the code",
          type: "ERROR_GENERAL",
        }),
      );
      return;
    }
    mutation.mutate({ code });
  };

  return (
    <div className="relative mx-auto h-[190px] w-[90%] overflow-hidden rounded-lg border border-gray-500 sm:w-[490px] lg:h-[250px] lg:w-[600px]">
      <span
        onClick={() => dispatch(resetModel())}
        className="absolute right-0 top-0 z-[1] p-1 text-2xl lg:text-4xl"
      >
        <IoClose />
      </span>
      <div
        className={cn(
          "flex flex-col gap-2 bg-[#1a0a0aee] transition-all duration-500 ease-in",
          openHelp ? "-translate-y-[0px]" : "-translate-y-[200px] lg:-translate-y-[260px]",
        )}
      >
        <div className="h-[190px] bg-[#2e3052] p-1 lg:h-[250px] lg:p-4">
          <p className="flex items-center gap-2">
            <span className="rounded-lg bg-[#f059597a] p-1 lg:p-2">
              <FaHandsHelping />
            </span>
            <span className="text-sm font-bold text-[#8ee06d]">can get copoun code throughout :</span>
          </p>
          <ul className="ml-2 mt-1 h-[65%] md:ml-6">
            <li className="flex items-center gap-1 md:gap-2">
              <span className="h-3 w-3 rounded-full bg-[#469636]"></span>
              <p className="text-sm text-gray-400 md:text-base">
                Bonus code in Reward page click
                <button
                  onClick={() => {
                    dispatch(resetModel());
                    navigate("/rewards?to=bonus-code");
                  }}
                  className="ml-1 text-[#aa7ee4] underline"
                >
                  Here
                </button>
              </p>
            </li>
          </ul>
          <button
            onClick={() => setOpenHelp((prev) => !prev)}
            className="mt-1 flex w-full items-center justify-center gap-1 rounded-sm bg-[#443f3f] px-3 py-1 text-gray-300"
          >
            <CgPushDown className="" /> Go Back
          </button>
        </div>
        <div className="flex h-[190px] flex-col items-center gap-2 overflow-x-auto rounded-lg bg-[#2e3052] p-2 scrollbar-none md:gap-4 lg:h-[250px] lg:p-5">
          <button
            style={{ fontFamily: "monospace" }}
            onClick={() => setOpenHelp((prev) => !prev)}
            className="flex items-center gap-2 self-start text-base font-bold text-[#cfdbee] underline sm:text-lg lg:text-xl"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#34ee4333]">
              <FaRegArrowAltCircleUp />
            </span>
            How can I get Bonus Code ?
          </button>
          <div
            className={cn(
              "flex items-center justify-center transition-all",
              mutation.isError || mutation.isPending ? "h-5" : "h-0 overflow-hidden",
            )}
          >
            {mutation.isPending && <Spinner />}
            {mutation.error && (
              <span className="flex w-full items-center gap-2 pl-1 text-sm text-red-400">
                <FaExclamationCircle className="text-sm opacity-60" /> {mutation.error.response?.data.error}
              </span>
            )}
          </div>
          <div className="flex w-full flex-col items-start gap-1 sm:flex-row">
            <input
              type="text"
              value={code}
              placeholder="Enter Bonus Code"
              onChange={(e) => setCode(e.target.value)}
              className="w-full flex-1 rounded-sm border border-gray-700 bg-[#3d1111] p-1 text-sm tracking-wider text-[#5b9dff] outline-none placeholder:text-sm placeholder:text-gray-500 focus:border-gray-500 md:p-2 md:text-base"
            />
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={applyHandler}
                className="rounded-sm border border-gray-600 bg-[#01D676] px-5 py-1 text-sm font-bold text-black md:py-2 md:text-base"
              >
                APPLY
              </button>
              <button
                onClick={() => {
                  dispatch(resetModel());
                }}
                className="rounded-sm border border-gray-600 bg-[#01D676] px-4 py-1 text-sm font-bold text-black md:py-2 md:text-base"
              >
                CANCEL
              </button>
            </div>
          </div>
          <div className="h-[100px] w-full overflow-hidden rounded-lg">
            <img alt="" src={bonusImage} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyCoupon;
