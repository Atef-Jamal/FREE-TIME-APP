import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import Spinner from "../Others/Spinner";
import { purshaseFrame } from "../../utils";
import { handleApiError } from "../../utils/common";
import { TypeFrame } from "../../types/frameTypes";
import { useMutation } from "@tanstack/react-query";

interface TypeProps {
  singleFrame: TypeFrame;
}

const FrameItem = ({ singleFrame }: TypeProps) => {
  const isCurrentUserReqFinished = useAppSelector((state) => state.stateManeger.isCurrentUserReqFinished);
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const purshasedByCurrentUser = !!currentUser?.myFrames.find((item) => item._id === singleFrame._id);
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: purshaseFrame,
    onError: (error) => {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    },
    onSuccess: (data) => {
      if (!currentUser) return;
      dispatch(
        setCurrentUser({
          ...currentUser,
          points: data.points,
          myFrames: [...currentUser.myFrames, data.savedFrame],
        }),
      );
    },
  });

  const handlePurshaseFrame = () => {
    if (!currentUser) {
      dispatch(
        showPopup({
          type: "ERROR_LOCK",
          message: "Log In First",
        }),
      );
      return;
    }
    mutation.mutate({ frameId: singleFrame._id });
  };

  return (
    <div id={singleFrame._id} className="flex flex-col justify-center p-2 bg-[#5b667a42] rounded-md ">
      <div className="relative">
        <img src={singleFrame.image} alt="" className="w-full h-[120px] rounded-md mb-3" />
        <span className="absolute bg-[#222339] w-[70%] h-[65%] top-0 translate-y-[19%] translate-x-[22%]"></span>
      </div>
      <div className="mt-2 overflow-hidden">
        <p className=" text-xs font-extrabold text-[#58eb78] mb-1 sm:mb-[2px]">
          Title:
          <span className="font-[200] text-[#b2cdf0d5] ml-2">{singleFrame.title}</span>
        </p>
        <p className="text-xs font-extrabold text-[#58eb78] mb-1 sm:mb-[2px] whitespace-nowrap">
          description :
          <span className="font-[200] text-[#b2cdf0d5] ml-2 overflow-hidden">{singleFrame.description}</span>
        </p>
        <span className="text-sm font-extrabold text-[#58eb78] mb-1 sm:mb-[2px]">
          Price :<span className="font-[200] text-[#b2cdf0d5] ml-2">{singleFrame.price}</span>
        </span>
      </div>

      {isCurrentUserReqFinished && purshasedByCurrentUser && (
        <button
          onClick={() =>
            dispatch(
              showPopup({
                type: "ERROR_GENERAL",
                message: "Already Buyed. Try with another Frames",
              }),
            )
          }
          className="text-sm border border-gray-500 bg-[#1a202c] rounded-md py-[6px] mt-3 text-[#ffffff] font-bold"
        >
          Purshased
        </button>
      )}
      {isCurrentUserReqFinished && !purshasedByCurrentUser && (
        <button
          onClick={handlePurshaseFrame}
          disabled={mutation.isPending}
          className="text-sm  border border-gray-500 bg-[#4ab646] rounded-md py-[6px] mt-3 font-bold "
        >
          {mutation.isPending ? (
            <Spinner className="w-5 h-5 mx-auto border-b-[#252525]  border-l-[#252525]" />
          ) : (
            <p className="text-[#252525]">Buy Now</p>
          )}
        </button>
      )}

      {!isCurrentUserReqFinished && (
        <span className="text-sm  border border-gray-500 rounded-md py-1 mt-3 font-bold">
          <Spinner className="w-5 h-5 mx-auto border-t-[#533a70] border-r-[#533a70]" />
        </span>
      )}
    </div>
  );
};

export default FrameItem;
