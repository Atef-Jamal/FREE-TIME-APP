import { FaAngleLeft } from "react-icons/fa";
import { IoMdPause } from "react-icons/io";
import { IoMdPlay } from "react-icons/io";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import { memo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import {
  handleCloseMusic,
  handlePauseMusic,
  handlePlayMusic,
  toggleThisEntity,
} from "../../context/StateManeger";
import { MdClose } from "react-icons/md";

const MusicPlayer = memo(() => {
  const [expand, setExpand] = useState(false);
  const [trackValue, setTrackValue] = useState(0);
  const activeMusic = useAppSelector((state) => state.stateManeger.activeMusic);
  const musicIsPlaying = useAppSelector((state) => state.stateManeger.musicIsPlaying);
  const dispatch = useAppDispatch();

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return formattedTime;
  };

  useEffect(() => {
    const activeMusicAudio = activeMusic.audio;
    const handleTimeUpdate = (event: Event) => {
      const element = event.target as HTMLAudioElement;
      setTrackValue(element.currentTime);
    };

    const handleMusicEnded = () => {
      dispatch(handlePauseMusic());
      setTrackValue(0);
    };

    activeMusicAudio.addEventListener("timeupdate", handleTimeUpdate);
    activeMusicAudio.addEventListener("ended", handleMusicEnded);

    return () => {
      activeMusicAudio.removeEventListener("timeupdate", handleTimeUpdate);
      activeMusicAudio.removeEventListener("ended", handleMusicEnded);
    };
  }, [activeMusic.audio, dispatch]);

  return (
    <div
      className={`transition-all ${
        !expand ? "translate-x-0" : "-translate-x-[92%] sm:-translate-x-[90%]"
      } w-[360px] sm:w-[260px] h-full sm:h-full rounded-lg xs:rounded-s-none xs:absolute left-0 top-0 flex items-center justify-between  bg-[#3d4174c0]`}
    >
      <div className=" w-full h-full xs:px-1 px-3 flex justify-between items-center gap-2">
        <span
          className={`transition-all  ${
            musicIsPlaying ? "animate-spin " : ""
          } w-10 h-10 rounded-full border-2 border-l-[#ffae45] border-t-[#222770] border-r-[#cef03a] border-b-[#192461]`}
        >
          <img src={activeMusic.musicInfo?.cover} alt="" className="w-full h-full rounded-full" />
        </span>
        <div className="w-[75%] h-full flex flex-col justify-between py-1">
          <span className=" w-full flex items-center justify-between">
            <span className="w-[120px] text-xs text-[#abcdff] truncate font-bold ">
              {activeMusic.musicInfo?.title || "Song name"}
              <span className="text-[#e6f74e] font-extrabold mx-2">|</span>
              {activeMusic.musicInfo?.artist || "Artist name"}
            </span>
          </span>
          <div className="grid grid-cols-4 -mt-[6px] ">
            <span>
              <IoPlaySkipBackSharp />
            </span>
            {musicIsPlaying && (
              <span onClick={() => dispatch(handlePauseMusic())}>
                <IoMdPause />
              </span>
            )}
            {!musicIsPlaying && (
              <span onClick={() => dispatch(handlePlayMusic())}>
                <IoMdPlay />
              </span>
            )}
            <span>
              <IoPlaySkipForward />
            </span>
            {!!activeMusic.audio.duration && (
              <span className="text-xs text-gray-300 ml-auto">{formatTime(activeMusic.audio.duration)}</span>
            )}
          </div>
          <input
            type="range"
            id="trackSong"
            min={0}
            max={Math.floor(activeMusic.audio.duration).toString()}
            value={trackValue}
            onChange={(e) => {
              activeMusic.audio.currentTime = Number(e.target.value);
            }}
            className="w-full h-[4px] outline-none"
          />
        </div>
      </div>
      <span className=" h-full bg-[#5aec7f] w-[30px] flex flex-col items-center justify-center cursor-pointer">
        <span
          onClick={() => {
            dispatch(handleCloseMusic());
            dispatch(toggleThisEntity({ entity: "openMusicModal", value: false }));
          }}
          className="w-full h-[40%] flex items-center justify-center bg-[#c96d6d] "
        >
          <MdClose className="text-2xl" />
        </span>
        <FaAngleLeft onClick={() => setExpand((prev) => !prev)} className="text-2xl w-full h-[60%]" />
      </span>
    </div>
  );
});

export default MusicPlayer;
