import { useAppDispatch, useAppSelector } from "../../../context/hooks";
import { setCurrentUser, openToast, selectUserAuth, selectCurrentUser } from "../../../context/appStateSlice";
import { displaySound, handleApiError } from "../../../utils";
import type { IFrame } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../../components/Shared/Spinner";
import notificationSoundSrc from "../../../assets/audios/notificationSound.wav";
import { purshaseFrame } from "../services";
import { addNewNotificationCache } from "../../notifications/cache";

interface IProps {
  singleFrame: IFrame;
}

const FrameItem = ({ singleFrame }: IProps) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const userAuth = useAppSelector(selectUserAuth);
  const purshasedByCurrentUser = !!currentUser?.myFrames.find((item) => item._id === singleFrame._id);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: purshaseFrame,
    onSuccess: (data) => {
      if (!currentUser) return;
      addNewNotificationCache({ queryClient, newNotification: data.notification });
      dispatch(
        setCurrentUser({
          ...currentUser,
          points: data.points,
          myFrames: [...currentUser.myFrames, data.frame],
        }),
      );
      displaySound(notificationSoundSrc);
    },
    onError: (error) => {
      dispatch(
        openToast({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    },
  });

  const handlePurshaseFrame = () => {
    if (!currentUser) {
      dispatch(
        openToast({
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

      {userAuth === "authenticated" && purshasedByCurrentUser && (
        <button
          onClick={() =>
            dispatch(
              openToast({
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
      {userAuth !== "pending" && !purshasedByCurrentUser && (
        <button
          onClick={handlePurshaseFrame}
          disabled={mutation.isPending}
          className="mt-3 flex h-[29px] items-center justify-center rounded-md border border-gray-500 bg-[#4ab646] text-sm font-bold"
        >
          {mutation.isPending ? <Spinner color="blue" /> : <p className="text-[#252525]">Buy Now</p>}
        </button>
      )}

      {userAuth === "pending" && (
        <span className="mt-3 flex h-[29px] items-center justify-center rounded-md border border-gray-500 text-sm font-bold">
          <Spinner />
        </span>
      )}
    </div>
  );
};

export default FrameItem;
