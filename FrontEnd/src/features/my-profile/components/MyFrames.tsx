import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../../context/hooks";
import { openToast, selectCurrentUser, setCurrentUser } from "../../../context/appStateSlice";
import { changeMyPictureFrame } from "../services";
import { handleApiError } from "../../../utils";
import Empty from "../../../components/Shared/Empty";
import { IFrame } from "../../marketplace/types";

const MyFrames = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const changeMutation = useMutation({
    mutationFn: changeMyPictureFrame,
    onSuccess: (frame) => {
      if (!currentUser) return;
      dispatch(setCurrentUser({ ...currentUser, activeFrame: frame }));
      dispatch(
        openToast({
          message: "Changed Successfully",
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

  return (
    <div
      id="my-frames"
      className="mt-5 flex flex-col items-center justify-center gap-2 rounded-md bg-[#222339] p-2"
    >
      <span className="font-bold text-[#7dec73]">My Frames</span>
      <div className={`grid w-full grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5`}>
        {currentUser?.myFrames?.map((item: IFrame) => {
          return (
            <div
              key={item._id}
              id={item._id}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-md bg-[#5b667a42] px-2 py-3"
            >
              <div className="relative flex w-full items-center justify-center">
                <img
                  src={item.image}
                  alt=""
                  className="mb-3 h-[120px] w-[70%] rounded-md sm:h-[90px] lg:h-[110px] lg:w-full"
                />
                <span className="absolute left-[29%] top-[16%] w-[55%] bg-[#222339] md:left-[22%] md:top-[18%] md:h-[52%] md:w-[55%] lg:h-[59%] lg:w-[43%]"></span>
              </div>
              {currentUser?.activeFrame?._id === item._id ? (
                <button
                  onClick={() => changeMutation.mutate({ frameId: item._id, action: "unselect" })}
                  className="mx-auto w-[95%] rounded-md bg-[#2d704ad8] py-1 text-center font-bold md:w-[80%]"
                >
                  unselect
                </button>
              ) : (
                <button
                  onClick={() => changeMutation.mutate({ frameId: item._id, action: "select" })}
                  className="mx-auto w-[95%] rounded-md bg-[#467cce71] py-1 text-center font-bold md:w-[80%]"
                >
                  select
                </button>
              )}
            </div>
          );
        })}
      </div>
      {currentUser?.myFrames.length === 0 && <Empty text="Empty Frames" />}
    </div>
  );
};

export default MyFrames;
