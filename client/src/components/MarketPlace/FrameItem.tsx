import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { TypeFrame } from "../../types";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import Spinner from "../Others/Spinner";
import { handleApiError, makeRequest } from "../../utils";
import { BiErrorAlt } from "react-icons/bi";
import { IoLockClosed } from "react-icons/io5";

const FrameItem = ({ singleFrame }: { singleFrame: TypeFrame }) => {
  const { currentUser, currentUserIsFetched } = useAppSelector(
    (state) => state.stateManeger
  );
  const purshasedByCurrentUser = !!currentUser?.myFrames.find(
    (item) => item._id === singleFrame._id
  );

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const buyNow = async (frameId: string) => {
    if (!currentUser) {
      dispatch(
        showPopup({
          status: true,
          message: "Sign In First",
          icon: <IoLockClosed />,
        })
      );
      return;
    }
    setIsLoading(true);
    try {
      const response = await makeRequest.get(`api/frames/${frameId}`);
      if (response.status === 200) {
        dispatch(
          setCurrentUser({
            ...currentUser,
            points: response.data.points,
            myFrames: [...currentUser.myFrames, response.data.savedFrame],
          })
        );
      }
    } catch (error: any) {
      dispatch(
        showPopup({
          status: true,
          message: handleApiError(error),
          icon: <BiErrorAlt />,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center p-2 bg-[#5b667a42] rounded-md ">
      <div className="relative">
        <img
          src={singleFrame.image}
          alt=""
          className="w-full h-[120px] rounded-md mb-3"
        />
        <span className="absolute bg-[#222339] w-[70%] h-[65%] top-0 translate-y-[19%] translate-x-[22%]"></span>
      </div>
      <div className="mt-2 overflow-hidden">
        <p className=" text-xs font-extrabold text-[#58eb78] mb-1 sm:mb-[2px]">
          Title:
          <span className="font-[200] text-[#b2cdf0d5] ml-2">
            {singleFrame.title}
          </span>
        </p>
        <p className="text-xs font-extrabold text-[#58eb78] mb-1 sm:mb-[2px] whitespace-nowrap">
          description :
          <span className="font-[200] text-[#b2cdf0d5] ml-2 overflow-hidden">
            {singleFrame.description}
          </span>
        </p>
        <span className="text-sm font-extrabold text-[#58eb78] mb-1 sm:mb-[2px]">
          Price :
          <span className="font-[200] text-[#b2cdf0d5] ml-2">
            {singleFrame.price}
          </span>
        </span>
      </div>

      {currentUserIsFetched && purshasedByCurrentUser && (
        <button
          onClick={() =>
            dispatch(
              showPopup({
                status: true,
                message: "Already Buyed. Try with another Frames",
                icon: <BiErrorAlt />,
              })
            )
          }
          className="text-sm border border-gray-500 bg-[#6b788f52] rounded-md py-[6px] mt-3 text-[#ffffff] font-bold"
        >
          Purshased
        </button>
      )}
      {currentUserIsFetched && !purshasedByCurrentUser && (
        <button
          onClick={() => buyNow(singleFrame._id)}
          className="text-sm  border border-gray-500 bg-[#65e661] rounded-md py-[6px] mt-3 font-bold"
        >
          {isLoading ? (
            <Spinner className="w-5 h-5 mx-auto border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            " Buy Now"
          )}
        </button>
      )}

      {!currentUserIsFetched && (
        <span className="text-sm  border border-gray-500 rounded-md py-1 mt-3 font-bold">
          <Spinner className="w-5 h-5 mx-auto border-t-[#533a70] border-r-[#533a70]" />
        </span>
      )}
    </div>
  );
};

export default FrameItem;
