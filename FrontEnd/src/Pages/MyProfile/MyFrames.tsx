import { useMutation } from "@tanstack/react-query";
import { IFrame } from "../../types/frameTypes";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { changeMyPictureFrame, unselectMyPictureFrame } from "../../utils";
import { handleApiError } from "../../utils/common";
import Empty from "../../components/Shared/Common/Empty";

const MyFrames = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const dispatch = useAppDispatch();

  const changeMutation = useMutation({
    mutationFn: changeMyPictureFrame,
    onSuccess: (frame) => {
      if (!currentUser) return;
      dispatch(setCurrentUser({ ...currentUser, activeFrame: frame }));
      dispatch(
        showPopup({
          message: "Changed Successfully",
          type: "SUCESS",
        }),
      );
      socket?.emit("user-updated", {
        ...currentUser,
        activeFrame: frame,
      });
    },
    onError: (error) => {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
      );
    },
  });
  const unselectMutation = useMutation({
    mutationFn: unselectMyPictureFrame,
    onSuccess: () => {
      if (!currentUser) return;
      dispatch(setCurrentUser({ ...currentUser, activeFrame: null }));
      dispatch(
        showPopup({
          message: "Removed Successfully",
          type: "SUCESS",
        }),
      );
      socket?.emit("user-updated", { ...currentUser, activeFrame: null });
    },
    onError: (error) => {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
      );
    },
  });

  const changeFrameHandler = (frameId: string) => {
    if (currentUserStatus !== "authenticated") return;
    changeMutation.mutate({ frameId });
  };

  const unselectFrameHandler = () => {
    if (currentUserStatus !== "authenticated") return;
    unselectMutation.mutate();
  };

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
                  onClick={unselectFrameHandler}
                  className="mx-auto w-[95%] rounded-md bg-[#2d704ad8] py-1 text-center font-bold md:w-[80%]"
                >
                  unselect
                </button>
              ) : (
                <button
                  onClick={() => changeFrameHandler(item._id)}
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
