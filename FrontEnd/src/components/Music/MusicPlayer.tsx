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
  updateThisEntity,
} from "../../context/StateManeger";
import { MdClose } from "react-icons/md";
import { cn } from "../../utils/common";

const MusicPlayer = memo(() => {
  const [expand, setExpand] = useState(false);
  const [trackValue, setTrackValue] = useState(0);
  const activeMusic = useAppSelector((state) => state.stateManeger.activeMusic);
  const musicIsPlaying = useAppSelector((state) => state.stateManeger.musicIsPlaying);
  const resizeSidebare = useAppSelector((state) => state.stateManeger.resizeSidebare);
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
      className={cn(
        "fixed top-32 z-[5] flex h-16 w-[80%] max-w-[360px] items-center justify-between bg-[#3d4174] transition-all lg:top-[100px]",
        resizeSidebare ? "lg:left-[65px]" : "lg:left-[250px]",
        expand && "-translate-x-[92%]",
      )}
    >
      <div className="flex h-full flex-1 items-center justify-between gap-2 px-2">
        <span
          className={`transition-all ${
            musicIsPlaying ? "animate-spin" : ""
          } h-11 w-11 rounded-full border-2 border-b-[#192461] border-l-[#ffae45] border-r-[#cef03a] border-t-[#222770]`}
        >
          <img src={activeMusic.musicInfo?.cover} alt="" className="h-full w-full rounded-full" />
        </span>
        <div className="flex h-full flex-1 flex-col justify-between py-[6px]">
          <span className="flex w-full items-center justify-between">
            <span className="w-[120px] truncate text-xs font-bold text-[#abcdff]">
              {activeMusic.musicInfo?.title || "----"}
              <span className="mx-2 font-extrabold text-[#e6f74e]">|</span>
              {activeMusic.musicInfo?.artist || "----"} 55ddj
            </span>
          </span>
          <div className="flex items-center justify-between">
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
              <span className="text-xs text-gray-300">{formatTime(activeMusic.audio.duration)}</span>
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
            className="h-1 w-full outline-none"
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
      <span
        onClick={() => setExpand((prev) => !prev)}
        className="flex h-full w-[30px] items-center justify-center bg-[#5d68cc]"
      >
        <FaAngleLeft className="text-2xl" />
      </span>
    </div>
  );
});

export default MusicPlayer;
