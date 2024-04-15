import { FaPlay } from "react-icons/fa6";
import { IoIosPause } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import {
  setCurrentSong,
  setCurrentUser,
  showPopup,
  toggleIsPlaying,
  toggleMusicModal,
} from "../../context/StateManeger";
import { FaRegCheckCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Spinner from "../Others/Spinner";
import { makeRequest } from "../../utils";
import { MdOutlineNoEncryptionGmailerrorred } from "react-icons/md";
import { BiErrorAlt } from "react-icons/bi";

const MusicCard = ({ songDetails }: { songDetails: any }) => {
  const { currentUser, currentSong, isPlaying } = useAppSelector(
    (state) => state.stateManeger
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPurshased, setIsPurshased] = useState(
    !!currentUser?.mySongs.includes(songDetails.id.toString())
  );

  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleClick = (song: any) => {
    dispatch(toggleMusicModal(true));
    const audioElement = document.getElementById("audioid") as HTMLAudioElement;

    if (currentSong?.id !== song.id) {
      if (audioElement.played) {
        audioElement.pause();
        audioElement.src = song.preview;
        dispatch(toggleIsPlaying(true));
        dispatch(setCurrentSong(song));
        audioElement.play();
      } else {
        audioElement.src = song.preview;
        dispatch(toggleIsPlaying(true));
        dispatch(setCurrentSong(song));
        audioElement.play();
      }
    } else {
      if (isPlaying) {
        audioElement.pause();
        dispatch(toggleIsPlaying(false));
      } else {
        audioElement.play();
        dispatch(toggleIsPlaying(true));
      }
    }
  };

  const buySong = async () => {
    if (!currentUser) {
      dispatch(
        showPopup({
          status: true,
          message: "Sign In First",
          icon: <MdOutlineNoEncryptionGmailerrorred />,
        })
      );
      return;
    }
    try {
      setIsLoading(true);
      const response = await makeRequest.post(
        `api/songs/buysong/${songDetails.id}`,
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
          status: true,
          message: "successfully purshased",
          icon: <FaRegCheckCircle />,
        })
      );
      setIsPurshased(true);
    } catch (err) {
      console.log(err);
      dispatch(
        showPopup({
          status: true,
          message: "Failed to Purshase This Music, try again",
          icon: <BiErrorAlt />,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-2 flex items-center justify-between flex-col h-[200px] bg-[#354253ee] rounded-md overflow-hidden">
      {isPurshased && location.pathname !== "/myprofile" && (
        <span className="absolute z-[1] top-5 -left-10 -rotate-45 bg-[#94d34b] font-extrabold text-sm xs:text-xs text-zinc-700 w-[90%] text-center py-1">
          My Music
        </span>
      )}
      <span
        className={`${
          isPlaying && currentSong?.id === songDetails.id ? "animate-spin" : ""
        } w-[80px] h-[80px] rounded-full border-2 border-l-[#cef03a] border-t-[#222770] border-r-[#cef03a] border-b-[#222770]`}
      >
        <img
          src={songDetails.album.cover}
          alt=""
          className="w-full h-full rounded-full"
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
        <button
          onClick={() => {
            handleClick(songDetails);
          }}
          className="rounded-md bg-[#4aa551] w-full py-1 text-gray-300 font-bold flex items-center justify-center"
        >
          {isPlaying && currentSong?.id === songDetails.id ? (
            <span className=" px-3 py-1">
              <IoIosPause />
            </span>
          ) : (
            <span className=" px-3 py-1">
              <FaPlay />
            </span>
          )}
          play
        </button>
      )}
    </div>
  );
};

export default MusicCard;
