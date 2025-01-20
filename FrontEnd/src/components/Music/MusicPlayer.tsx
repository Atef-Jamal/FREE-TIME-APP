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
  updateThisEntity,
} from "../../context/StateManeger";
import { MdClose } from "react-icons/md";

const MusicPlayer = memo(() => {
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
    <div className="flex h-20 items-center gap-x-3 bg-[#3d3e4b] px-1 lg:ml-4 lg:h-full lg:w-[300px]">
      <span
        className={`transition-all ${
          musicIsPlaying ? "animate-spin" : ""
        } h-10 w-10 rounded-full border-2 border-b-[#192461] border-l-[#ffae45] border-r-[#cef03a] border-t-[#222770]`}
      >
        <img src={activeMusic.musicInfo?.cover} alt="" className="h-full w-full rounded-full" />
      </span>
      <div className="flex h-full flex-1 flex-col justify-center gap-y-3 overflow-hidden lg:gap-y-[3px]">
        <div className="flex items-center justify-between">
          <span className="truncate text-xs text-[#abcdff]">
            {activeMusic.musicInfo?.title || "----"} | {activeMusic.musicInfo?.artist || "----"}
          </span>
          <span
            onClick={() => {
              dispatch(handleCloseMusic());
              dispatch(updateThisEntity({ entity: "openMusicModal", value: false }));
            }}
            className="flex h-full w-[35px] items-center justify-center rounded-sm bg-[#c06262]"
          >
            <MdClose />
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-5 lg:mr-10">
            <IoPlaySkipBackSharp size={13} />
          </span>
          {musicIsPlaying && (
            <span className="mr-5 lg:mr-10" onClick={() => dispatch(handlePauseMusic())}>
              <IoMdPause size={13} />
            </span>
          )}
          {!musicIsPlaying && (
            <span className="mr-5 lg:mr-10" onClick={() => dispatch(handlePlayMusic())}>
              <IoMdPlay size={13} />
            </span>
          )}
          <span className="">
            <IoPlaySkipForward size={13} />
          </span>
          {!!activeMusic.audio.duration && (
            <span className="ml-auto text-xs text-gray-300">{formatTime(activeMusic.audio.duration)}</span>
          )}
        </div>
        <input
          type="range"
          id="trackSong"
          min={0}
          max={Math.floor(activeMusic.audio.duration).toString()}
          value={trackValue}
          step={0.1}
          onChange={(e) => {
            activeMusic.audio.currentTime = Number(e.target.value);
          }}
          className="mt-1 h-[2px] w-full outline-none"
        />
      </div>
    </div>
  );
});

export default MusicPlayer;
