import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import {
  resetModel,
  setCurrentUser,
  showPopup,
} from "../../context/StateManeger";
import { CgPushDown } from "react-icons/cg";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import bonusImage from "../../assets/images/Bonus-Code.png";
import { FaHandsHelping } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { makeRequest } from "../../utils";
import { handleApiError } from "../../utils/common";

import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const ApplyCoupon = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openHelp, setOpenHelp] = useState<boolean>(false);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleApply = async () => {
    if (!currentUser) return;
    if (code.trim() === "") {
      setError("Enter your code");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const response = await makeRequest.post("api/coupons", {
        code,
      });

      if (response.status === 200) {
        dispatch(
          setCurrentUser({ ...currentUser, points: response.data.points })
        );
        dispatch(
          showPopup({
            status: true,
            message: "successfully applied",
            type: "SUCESS",
          })
        );
      }
      setLoading(false);
      setCode("");
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.error);
      dispatch(
        showPopup({
          status: true,
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        })
      );
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="overflow-hidden h-[250px] xs:h-[190px] rounded-lg w-[600px] sm:w-[490px] xs:w-[90%] border border-gray-500 mx-auto relative"
    >
      <span
        onClick={() => dispatch(resetModel())}
        className="absolute top-0 right-0 text-4xl sm:text-2xl z-[1]  p-1"
      >
        <IoClose />
      </span>
      <div
        className={`${
          openHelp
            ? "-translate-y-[0px]"
            : "-translate-y-[260px] xs:-translate-y-[200px]"
        } transition-all duration-500 ease-in flex flex-col gap-2 bg-[#1a0a0aee]`}
      >
        <div className=" bg-[#2e3052] p-4 xs:p-2 h-[250px] xs:h-[190px]">
          <p className="flex items-center gap-2">
            <span className="xs:p-1 p-2 bg-[#f059597a] rounded-lg ">
              <FaHandsHelping />
            </span>
            <span className=" text-[#8ee06d] font-bold text-lg xs:text-sm">
              can get copoun code throughout :
            </span>
          </p>
          <ul className="mt-1 ml-6 xs:ml-2  h-[65%]">
            <li className="flex gap-2 sm:gap-1">
              <span className="w-3 h-3 bg-[#469636] mt-1"></span>
              <span className=" text-lg text-gray-400 xs:text-sm">
                go to Reward Page click on Bonus code Button
                <button
                  onClick={() => {
                    navigate("/rewards?to=bonus-code");
                    //this timout to resolve some problem
                    const timout = setTimeout(() => {
                      dispatch(resetModel());
                    }, 0);
                    return () => clearTimeout(timout);
                  }}
                  className="ml-1 underline text-[#aa7ee4]"
                >
                  Here
                </button>
              </span>
            </li>
          </ul>
          <button
            onClick={() => setOpenHelp((prev) => !prev)}
            className="flex items-center justify-center gap-1 text-gray-300 px-3 bg-[#c921218f] rounded-md py-1 mt-1"
          >
            <CgPushDown className="" /> Go Back
          </button>
        </div>
        <div className="p-5 xs:p-2 bg-[#2e3052] rounded-lg flex flex-col items-center gap-4 xs:gap-2 overflow-x-scroll  scrollbar-none h-[250px] xs:h-[190px] ">
          <button
            style={{ fontFamily: "monospace" }}
            onClick={() => setOpenHelp((prev) => !prev)}
            className="self-start text-[#cfdbee] font-bold underline text-xl xs:text-[16px] flex items-center gap-2"
          >
            <span className="w-5 h-5 rounded-full bg-[#34ee4333] flex items-center justify-center">
              <FaRegArrowAltCircleUp />
            </span>
            How can I get Bonus Code ?
          </button>
          <span
            className={`transition-all flex items-center justify-center ${
              error || loading ? "h-5" : "h-0 overflow-hidden"
            } w-full`}
          >
            {loading && (
              <Spinner className="w-5 h-5 mx-auto border-b-[#ace769] border-l-[#ace769]" />
            )}
            {error && (
              <span className="w-full flex items-center gap-2 text-red-400 text-sm pl-1">
                <FaExclamationCircle className="opacity-60 text-sm" /> {error}
              </span>
            )}
          </span>
          <div className="flex items-center justify-between xs:justify-center xs:flex-wrap w-full xs:gap-1">
            <input
              type="text"
              value={code}
              placeholder="Enter Bonus Code"
              onChange={(e) => setCode(e.target.value)}
              className="w-[250px] xs:w-[190px] bg-[#3d1111] p-2 xs:p-1 tracking-widest text-[#5b9dff] rounded-sm border border-gray-700 placeholder:text-gray-500 xs:placeholder:text-sm outline-none focus:border-gray-500"
            />
            <div className="flex items-center gap-2 xs:gap-1 ml-1 ">
              <button
                onClick={handleApply}
                className="rounded-md px-5 py-2 xs:py-1 bg-[#01D676] xs:text-sm text-black font-bold border border-gray-600"
              >
                APPLY
              </button>
              <button
                onClick={() => {
                  dispatch(resetModel());
                }}
                className=" rounded-md px-4 py-2 xs:py-1 bg-[#01D676] xs:text-sm text-black font-bold border border-gray-600"
              >
                CANCEL
              </button>
            </div>
          </div>
          <div className="w-full h-[100px] overflow-hidden rounded-lg">
            <img
              alt=""
              src={bonusImage}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default ApplyCoupon;
