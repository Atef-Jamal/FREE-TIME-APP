import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { TypeFrame } from "../../types/frameTypes";
import { changeMyPictureFrame, unselectMyPictureFrame } from "../../utils";
import { setCurrentUser, showPopup } from "../../context/StateManeger";
import { handleApiError } from "../../utils/common";
import Empty from "../Others/Empty";

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
      className=" mt-5 flex flex-col gap-2 p-2 items-center justify-center bg-[#222339] rounded-md"
    >
      <span className="text-[#7dec73] font-bold">My Frames</span>
      <div className={`w-full grid grid-cols-5 lg:grid-cols-4 sm:grid-cols-4 xs:grid-cols-3 gap-2`}>
        {currentUser?.myFrames?.map((item: TypeFrame) => {
          return (
            <div
              key={item._id}
              id={item._id}
              className="flex flex-col items-center w-full justify-center gap-3 px-2 py-3 bg-[#5b667a42] rounded-md"
            >
              <div className="relative w-full flex items-center justify-center">
                <img
                  src={item.image}
                  alt=""
                  className="w-[70%] lg:w-full h-[120px] sm:h-[90px] lg:h-[110px] rounded-md mb-3"
                />
                <span className="absolute bg-[#222339] top-[16%] lg:top-[18%] left-[29%] lg:left-[22%] w-[43%] lg:w-[55%] sm:w-[55%] lg:h-[52%] h-[59%]"></span>
              </div>
              {currentUser?.activeFrame?._id === item._id ? (
                <button
                  onClick={unselectFrameHandler}
                  className="rounded-md font-bold bg-[#2d704ad8] w-[80%] xs:w-[95%] py-1 text-center mx-auto"
                >
                  unselect
                </button>
              ) : (
                <button
                  onClick={() => changeFrameHandler(item._id)}
                  className=" rounded-md font-bold bg-[#467cce71] w-[80%] xs:w-[95%]  py-1 text-center mx-auto"
                >
                  select
                </button>
              )}
            </div>
          );
        })}
      </div>
      {currentUser?.myFrames.length === 0 && <Empty emptyText="No Frames Buyed" />}
    </div>
  );
};

export default MyFrames;
