import { FaPlay } from "react-icons/fa6";
import { IoIosPause } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import {
  handleAddMusic,
  handlePauseMusic,
  handlePlayMusic,
  setCurrentUser,
  showPopup,
  toggleThisEntity,
} from "../../context/StateManeger";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Spinner from "../Others/Spinner";
import { makeRequest } from "../../utils";
import { handleApiError } from "../../utils/common";
import Image from "../Others/Image";

const MusicCard = ({ songDetails }: { songDetails: any }) => {
  const { currentUser, activeMusic, musicIsPlaying, openMusicModal } =
    useAppSelector((state) => state.stateManeger);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurshased, setIsPurshased] = useState(
    !!currentUser?.mySongs.includes(songDetails.id.toString())
  );

  const dispatch = useAppDispatch();
  const location = useLocation();

  const buySong = async () => {
    if (!currentUser) {
      dispatch(
        showPopup({
          message: "Log In First",
          type: "ERROR_LOCK",
        })
      );
      return;
    }
    try {
      setIsLoading(true);
      const response = await makeRequest.post(
        `api/songs/buy-song/${songDetails.id}`,
        {
          musicTitle: songDetails.title,
        }
      );
      dispatch(
        setCurrentUser({
          ...currentUser,
          points: response.data.points,
          mySongs: [...currentUser.mySongs, response.data.songId],
        })
      );
      dispatch(
        showPopup({
          type: "SUCESS",
          message: "successfully purshased",
        })
      );
      setIsPurshased(true);
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!openMusicModal) {
      dispatch(toggleThisEntity({ entity: "openMusicModal", value: true }));
    }
    dispatch(
      handleAddMusic({
        id: songDetails.id.toString(),
        musicSrc: songDetails.preview,
        title: songDetails.title,
        cover: songDetails.album.cover,
        artist: songDetails.artist.name,
      })
    );
  };

  return (
    <div
      id={songDetails.id.toString()}
      className="relative p-2 flex items-center justify-between flex-col h-[200px] bg-[#354253ee] rounded-md overflow-hidden"
    >
      {isPurshased && location.pathname !== "/myprofile" && (
        <span className="absolute z-[1] top-5 -left-10 -rotate-45 bg-[#94d34b] font-extrabold text-sm xs:text-xs text-zinc-700 w-[90%] text-center py-1">
          My Music
        </span>
      )}
      <span
        className={`${
          musicIsPlaying &&
          activeMusic.musicInfo?.id === songDetails.id.toString()
            ? "animate-spin"
            : ""
        } w-[80px] h-[80px] rounded-full border-2 border-l-[#cef03a] border-t-[#222770] border-r-[#cef03a] border-b-[#222770]`}
      >
        {/* <img
          src={songDetails.album.cover}
          alt=""
          className="w-full h-full rounded-full object-contain"
        /> */}
        <Image
          alt={""}
          src={songDetails.album.cover}
          className="w-full h-full rounded-full object-contain"
        />
      </span>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 truncate ">
            Title :
          </span>
          <span className="text-xs font-bold text-gray-300 truncate max-w-[85px]  text-center">
            {songDetails.title}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 truncate ">
            Singer :
          </span>
          <span className="text-xs font-bold text-gray-300 truncate max-w-[85px]  text-center">
            {songDetails.artist.name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 truncate ">
            Price :
          </span>
          <span className="text-xs font-bold text-gray-300 truncate ">
            10 Points
          </span>
        </div>
      </div>
      {!isPurshased && (
        <button
          onClick={buySong}
          className="rounded-md bg-[#5de768] w-full py-1 text-blue-800 font-bold text-center"
        >
          {isLoading ? (
            <Spinner className="w-6 h-6 mx-auto border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            "Buy"
          )}
        </button>
      )}
      {isPurshased && (
        <>
          {musicIsPlaying &&
            activeMusic.musicInfo?.id === songDetails.id.toString() && (
              <button
                onClick={() => dispatch(handlePauseMusic())}
                className="rounded-md bg-[#4aa551] w-full py-1 text-gray-300 font-bold flex items-center justify-center gap-2"
              >
                <IoIosPause />
                Pause
              </button>
            )}
          {!musicIsPlaying &&
            activeMusic.musicInfo?.id === songDetails.id.toString() && (
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
