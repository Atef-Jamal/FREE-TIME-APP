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
  const isCurrentUserReqFinished = useAppSelector((state) => state.stateManeger.isCurrentUserReqFinished);
  const isAlreadyPurshased = !!currentUser?.mySongs.includes(songDetails.id.toString());

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
  const dispatch = useAppDispatch();
  const location = useLocation();

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
      className="relative p-2 flex items-center justify-between flex-col h-[200px] bg-[#354253ee] rounded-md overflow-hidden"
    >
      {isAlreadyPurshased && location.pathname !== "/myprofile" && (
        <span className="absolute z-[1] top-5 -left-10 -rotate-45 bg-[#94d34b] font-extrabold text-sm xs:text-xs text-zinc-700 w-[90%] text-center py-1">
          My Music
        </span>
      )}
      <span
        className={`${
          musicIsPlaying && activeMusic.musicInfo?.id === songDetails.id.toString() ? "animate-spin" : ""
        } w-[80px] h-[80px] rounded-full border-2 border-l-[#cef03a] border-t-[#222770] border-r-[#cef03a] border-b-[#222770]`}
      >
        <img alt={""} src={songDetails.album.cover} className="w-full h-full rounded-full object-contain" />
      </span>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 truncate ">Title :</span>
          <span className="text-xs font-bold text-gray-300 truncate max-w-[85px]  text-center">
            {songDetails.title}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 truncate ">Singer :</span>
          <span className="text-xs font-bold text-gray-300 truncate max-w-[85px]  text-center">
            {songDetails.artist.name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 truncate ">Price :</span>
          <span className="text-xs font-bold text-gray-300 truncate ">10 Points</span>
        </div>
      </div>
      {!isCurrentUserReqFinished && (
        <button className="rounded-md bg-[#5de768] w-full py-1 text-blue-800 font-bold text-center">
          <Spinner className="w-6 h-6 mx-auto border-b-[#291a3b] border-l-[#291a3b]" />
        </button>
      )}
      {!isAlreadyPurshased && isCurrentUserReqFinished && (
        <button
          onClick={handlePurshase}
          className="rounded-md bg-[#5de768] w-full py-1 text-blue-800 font-bold text-center"
        >
          {mutation.isPending ? (
            <Spinner className="w-6 h-6 mx-auto border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            "Buy"
          )}
        </button>
      )}
      {isAlreadyPurshased && isCurrentUserReqFinished && (
        <>
          {musicIsPlaying && activeMusic.musicInfo?.id === songDetails.id.toString() && (
            <button
              onClick={() => dispatch(handlePauseMusic())}
              className="rounded-md bg-[#4aa551] w-full py-1 text-gray-300 font-bold flex items-center justify-center gap-2"
            >
              <IoIosPause />
              Pause
            </button>
          )}
          {!musicIsPlaying && activeMusic.musicInfo?.id === songDetails.id.toString() && (
            <button
              onClick={() => dispatch(handlePlayMusic())}
              className="rounded-md bg-[#4aa551] w-full py-1 text-gray-300 font-bold flex items-center justify-center gap-2"
            >
              <FaPlay />
              Play
            </button>
          )}
          {activeMusic.musicInfo?.id !== songDetails.id.toString() && (
            <button
              onClick={handleAdd}
              className="rounded-md bg-[#4aa551] w-full py-1 text-gray-300 font-bold flex items-center justify-center gap-2"
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
