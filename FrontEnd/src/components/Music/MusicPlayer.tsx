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
    <div className={"flex h-14 items-center justify-between bg-[#3d3e4b] lg:ml-4 lg:h-full lg:w-[300px]"}>
      <div className="flex h-full flex-1 items-center justify-between gap-x-2 px-1">
        <span
          className={`transition-all ${
            musicIsPlaying ? "animate-spin" : ""
          } h-10 w-10 rounded-full border-2 border-b-[#192461] border-l-[#ffae45] border-r-[#cef03a] border-t-[#222770]`}
        >
          <img src={activeMusic.musicInfo?.cover} alt="" className="h-full w-full rounded-full" />
        </span>
        <div className="flex h-full flex-1 flex-col justify-start">
          <span className="my-[3px] w-[140px] truncate text-xs font-bold text-[#abcdff] lg:w-[180px]">
            {activeMusic.musicInfo?.title || "----"} | {activeMusic.musicInfo?.artist || "----"}
          </span>
          <div className="mb-[5px] flex items-center">
            <span className="mr-5 lg:mr-8">
              <IoPlaySkipBackSharp size={13} />
            </span>
            {musicIsPlaying && (
              <span className="mr-5 lg:mr-8" onClick={() => dispatch(handlePauseMusic())}>
                <IoMdPause size={13} />
              </span>
            )}
            {!musicIsPlaying && (
              <span className="mr-5 lg:mr-8" onClick={() => dispatch(handlePlayMusic())}>
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
            onChange={(e) => {
              activeMusic.audio.currentTime = Number(e.target.value);
            }}
            className="mt-1 h-[2px] w-full outline-none"
          />
        </div>
      </div>
      <span
        onClick={() => {
          dispatch(handleCloseMusic());
          dispatch(updateThisEntity({ entity: "openMusicModal", value: false }));
        }}
        className="flex h-full w-[30px] items-center justify-center bg-[#be4b4b]"
      >
        <MdClose className="text-2xl" />
      </span>
      {/* <span
        onClick={() => setExpand((prev) => !prev)}
        className="flex h-full w-[30px] items-center justify-center bg-[#5d68cc]"
      >
        <FaAngleLeft className="text-2xl" />
      </span> */}
    </div>
  );
});

export default MusicPlayer;
