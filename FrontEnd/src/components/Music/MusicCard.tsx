import { FaPlay } from "react-icons/fa6";
import { IoIosPause } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { useLocation } from "react-router-dom";
import Spinner from "../Others/Spinner";
import { purshaseMusic } from "../../utils";
import { handleApiError } from "../../utils/common";
import { TypeMusicDetail } from "../../types/othersTypes";
import { useMutation } from "@tanstack/react-query";
import {
  handleAddMusic,
  handlePauseMusic,
  handlePlayMusic,
  setCurrentUser,
  showPopup,
  updateThisEntity,
} from "../../context/StateManeger";

interface TypeProps {
  songDetails: TypeMusicDetail;
}

const MusicCard = ({ songDetails }: TypeProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const activeMusic = useAppSelector((state) => state.stateManeger.activeMusic);
  const musicIsPlaying = useAppSelector((state) => state.stateManeger.musicIsPlaying);
  const openMusicModal = useAppSelector((state) => state.stateManeger.openMusicModal);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const isAlreadyPurshased = !!currentUser?.mySongs.includes(songDetails.id.toString());
  const dispatch = useAppDispatch();
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: purshaseMusic,
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
          mySongs: [...currentUser.mySongs, data.musicId],
        }),
      );
      dispatch(
        showPopup({
          type: "SUCESS",
          message: "successfully purshased",
        }),
      );
    },
  });

  const handlePurshase = () => {
    if (!currentUser) {
      dispatch(
        showPopup({
          message: "Log In First",
          type: "ERROR_LOCK",
        }),
      );
      return;
    }
    mutation.mutate({ musicId: songDetails.id.toString() });
  };

  const handleAdd = () => {
    if (!openMusicModal) {
      dispatch(updateThisEntity({ entity: "openMusicModal", value: true }));
    }
    dispatch(
      handleAddMusic({
        id: songDetails.id.toString(),
        musicSrc: songDetails.preview,
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
        className={`${
          musicIsPlaying && activeMusic.musicInfo?.id === songDetails.id.toString() ? "animate-spin" : ""
        } h-[80px] w-[80px] rounded-full border-2 border-b-[#222770] border-l-[#cef03a] border-r-[#cef03a] border-t-[#222770]`}
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
        <button className="w-full rounded-md bg-[#5de768] py-1 text-center font-bold text-blue-800">
          <Spinner className="mx-auto h-6 w-6 border-b-[#291a3b] border-l-[#291a3b]" />
        </button>
      )}
      {!isAlreadyPurshased && currentUserStatus !== "pending" && (
        <button
          onClick={handlePurshase}
          className="w-full rounded-md bg-[#5de768] py-1 text-center font-bold text-blue-800"
        >
          {mutation.isPending ? (
            <Spinner className="mx-auto h-6 w-6 border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            "Buy"
          )}
        </button>
      )}
      {isAlreadyPurshased && currentUserStatus !== "pending" && (
        <>
          {musicIsPlaying && activeMusic.musicInfo?.id === songDetails.id.toString() && (
            <button
              onClick={() => dispatch(handlePauseMusic())}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#4aa551] py-1 font-bold text-gray-300"
            >
              <IoIosPause />
              Pause
            </button>
          )}
          {!musicIsPlaying && activeMusic.musicInfo?.id === songDetails.id.toString() && (
            <button
              onClick={() => dispatch(handlePlayMusic())}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#4aa551] py-1 font-bold text-gray-300"
            >
              <FaPlay />
              Play
            </button>
          )}
          {activeMusic.musicInfo?.id !== songDetails.id.toString() && (
            <button
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#4aa551] py-1 font-bold text-gray-300"
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
