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
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
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
    <div id={singleFrame._id} className="flex flex-col justify-center rounded-md bg-[#5b667a42] p-2">
      <div className="relative">
        <img src={singleFrame.image} alt="" className="mb-3 h-[120px] w-full rounded-md" />
        <span className="absolute top-0 h-[65%] w-[70%] translate-x-[22%] translate-y-[19%] bg-[#222339]"></span>
      </div>
      <div className="mt-2 overflow-hidden">
        <p className="mb-[2px] text-xs font-extrabold text-[#58eb78] sm:mb-1">
          Title:
          <span className="ml-2 font-[200] text-[#b2cdf0d5]">{singleFrame.title}</span>
        </p>
        <p className="mb-[2px] whitespace-nowrap text-xs font-extrabold text-[#58eb78] sm:mb-1">
          description :
          <span className="ml-2 overflow-hidden font-[200] text-[#b2cdf0d5]">{singleFrame.description}</span>
        </p>
        <span className="mb-[2px] text-sm font-extrabold text-[#58eb78] sm:mb-1">
          Price :<span className="ml-2 font-[200] text-[#b2cdf0d5]">{singleFrame.price}</span>
        </span>
      </div>

      {currentUserStatus !== "pending" && purshasedByCurrentUser && (
        <button
          onClick={() =>
            dispatch(
              showPopup({
                type: "ERROR_GENERAL",
                message: "Already Buyed. Try with another Frames",
              }),
            )
          }
          className="mt-3 rounded-md border border-gray-500 bg-[#1a202c] py-[6px] text-sm font-bold text-[#ffffff]"
        >
          Purshased
        </button>
      )}
      {currentUserStatus !== "pending" && !purshasedByCurrentUser && (
        <button
          onClick={handlePurshaseFrame}
          disabled={mutation.isPending}
          className="mt-3 rounded-md border border-gray-500 bg-[#4ab646] py-[6px] text-sm font-bold"
        >
          {mutation.isPending ? (
            <Spinner className="mx-auto h-5 w-5 border-b-[#252525] border-l-[#252525]" />
          ) : (
            <p className="text-[#252525]">Buy Now</p>
          )}
        </button>
      )}

      {currentUserStatus === "pending" && (
        <span className="mt-3 rounded-md border border-gray-500 py-1 text-sm font-bold">
          <Spinner className="mx-auto h-5 w-5 border-r-[#533a70] border-t-[#533a70]" />
        </span>
      )}
    </div>
  );
};

export default FrameItem;
