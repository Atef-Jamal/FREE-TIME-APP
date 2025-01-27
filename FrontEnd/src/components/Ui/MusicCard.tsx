import { FaPlay } from "react-icons/fa6";
import { IoIosPause } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { useLocation } from "react-router-dom";
import { purshaseMusic } from "../../services";
import { cn, handleApiError } from "../../utilities";
import { IMusicDetail } from "../../types/othersTypes";
import { useMutation } from "@tanstack/react-query";
import { handleAddMusic, setCurrentUser, openToast, updateThisEntity } from "../../context/appStateSlice";
import Spinner from "../Shared/Common/Spinner";

interface IProps {
  songDetails: IMusicDetail;
}

const MusicCard = ({ songDetails }: IProps) => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
  const activeMusic = useAppSelector((state) => state.appState.activeMusic);
  const musicIsPlaying = useAppSelector((state) => state.appState.musicIsPlaying);
  const openMusicModal = useAppSelector((state) => state.appState.openMusicModal);
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  const isAlreadyPurshased = !!currentUser?.mySongs.includes(songDetails.id.toString());
  const dispatch = useAppDispatch();
  const location = useLocation();

  const audioElement = document.getElementById("audioElement") as HTMLAudioElement;

  const mutation = useMutation({
    mutationFn: purshaseMusic,
    onError: (error) => {
      dispatch(
        openToast({
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
          mySongs: [...currentUser.mySongs, data.musicId],
        }),
      );
      dispatch(
        openToast({
          type: "SUCESS",
          message: "successfully purshased",
        }),
      );
    },
  });

  const handlePurshase = () => {
    if (!currentUser) {
      dispatch(
        openToast({
          message: "Log In First",
          type: "ERROR_LOCK",
        }),
      );
      return;
    }
    mutation.mutate({ musicId: songDetails.id.toString(), musicTitle: songDetails.title });
  };

  const handleAdd = () => {
    if (!openMusicModal) {
      dispatch(updateThisEntity({ entity: "openMusicModal", value: true }));
    }
    audioElement.src = songDetails.preview;
    audioElement.play();
    dispatch(
      handleAddMusic({
        id: songDetails.id.toString(),
        title: songDetails.title,
        cover: songDetails.album.cover,
        artist: songDetails.artist.name,
      }),
    );
  };

  return (
    <div
      id={songDetails.id.toString()}
      className="relative flex h-[200px] flex-col items-center justify-between overflow-hidden rounded-md bg-[#354253ee] p-2"
    >
      {isAlreadyPurshased && location.pathname !== "/myprofile" && (
        <span className="absolute -left-10 top-5 z-[1] w-[90%] -rotate-45 bg-[#94d34b] py-1 text-center text-xs font-extrabold text-zinc-700 md:text-sm">
          My Music
        </span>
      )}
      <span
        className={cn(
          "h-[80px] w-[80px] rounded-full border-2 border-b-[#222770] border-l-[#cef03a] border-r-[#cef03a] border-t-[#222770]",
          musicIsPlaying && activeMusic?.id === songDetails.id.toString() && "animate-spin",
        )}
      >
        <img alt={""} src={songDetails.album.cover} className="h-full w-full rounded-full object-contain" />
      </span>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="truncate text-xs font-bold text-gray-400">Title :</span>
          <span className="max-w-[85px] truncate text-center text-xs font-bold text-gray-300">
            {songDetails.title}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="truncate text-xs font-bold text-gray-400">Singer :</span>
          <span className="max-w-[85px] truncate text-center text-xs font-bold text-gray-300">
            {songDetails.artist.name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="truncate text-xs font-bold text-gray-400">Price :</span>
          <span className="truncate text-xs font-bold text-gray-300">10 Points</span>
        </div>
      </div>
      {currentUserStatus === "pending" && (
        <button className="flex h-[29px] w-full items-center justify-center rounded-md bg-[#5de768] text-center font-bold text-blue-800">
          <Spinner color="blue" />
        </button>
      )}
      {!isAlreadyPurshased && currentUserStatus !== "pending" && (
        <button
          onClick={handlePurshase}
          className="flex h-[29px] w-full items-center justify-center rounded-md bg-[#5de768] text-center font-bold text-blue-800"
        >
          {mutation.isPending ? <Spinner color="blue" /> : "Buy"}
        </button>
      )}
      {isAlreadyPurshased && currentUserStatus !== "pending" && (
        <>
          {musicIsPlaying && activeMusic?.id === songDetails.id.toString() && (
            <button
              onClick={() => {
                audioElement.pause();
                dispatch(updateThisEntity({ entity: "musicIsPlaying", value: false }));
              }}
              className="flex h-[29px] w-full items-center justify-center gap-2 rounded-md bg-[#4aa551] font-bold text-gray-300"
            >
              <IoIosPause />
              Pause
            </button>
          )}
          {!musicIsPlaying && activeMusic?.id === songDetails.id.toString() && (
            <button
              onClick={() => {
                audioElement.play();
                dispatch(updateThisEntity({ entity: "musicIsPlaying", value: true }));
              }}
              className="flex h-[29px] w-full items-center justify-center gap-2 rounded-md bg-[#4aa551] font-bold text-gray-300"
            >
              <FaPlay />
              Play
            </button>
          )}
          {activeMusic?.id !== songDetails.id.toString() && (
            <button
              onClick={handleAdd}
              className="flex h-[29px] w-full items-center justify-center gap-2 rounded-md bg-[#4aa551] font-bold text-gray-300"
            >
              <FaPlay />
              Play
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default MusicCard;
