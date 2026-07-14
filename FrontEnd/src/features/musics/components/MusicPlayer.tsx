import { IoMdPause } from "react-icons/io";
import { IoMdPlay } from "react-icons/io";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import { memo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../context/hooks";
import {
  handleCloseMusic,
  selectActiveMusic,
  selectMusicIsPlaying,
  selectSidebarCollapsed,
  updateStateField,
} from "../../../context/appStateSlice";
import { MdClose } from "react-icons/md";
import { cn } from "../../../utils";

const MusicPlayer = memo(() => {
  const [trackValue, setTrackValue] = useState(0);
  const activeMusic = useAppSelector(selectActiveMusic);
  const musicIsPlaying = useAppSelector(selectMusicIsPlaying);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const dispatch = useAppDispatch();

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return formattedTime;
  };

  const audioElement = document.getElementById("audioElement") as HTMLAudioElement;

  const handlePlayPauseMusic = () => {
    if (musicIsPlaying) {
      audioElement.pause();
      dispatch(updateStateField({ entity: "musicIsPlaying", value: false }));
    }
    if (!musicIsPlaying) {
      audioElement.play();
      dispatch(updateStateField({ entity: "musicIsPlaying", value: true }));
    }
  };

  useEffect(() => {
    const handleTimeUpdate = (event: Event) => {
      const element = event.target as HTMLAudioElement;
      setTrackValue(element.currentTime);
    };

    const handleMusicEnded = () => {
      audioElement.pause();
      dispatch(updateStateField({ entity: "musicIsPlaying", value: false }));
      setTrackValue(0);
    };

    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleMusicEnded);

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleMusicEnded);
    };
  }, [audioElement, dispatch]);

  return (
    <div className="flex h-20 items-center justify-center gap-x-3 rounded-md bg-[#3d3e4b] px-1">
      <button
        onClick={handlePlayPauseMusic}
        className={cn(
          "h-10 w-10 rounded-full border-2 border-b-[#192461] border-l-[#ffae45] border-r-[#cef03a] border-t-[#222770] transition-all",
          musicIsPlaying && "animate-spin",
        )}
      >
        <img src={activeMusic?.cover} alt="" className="h-full w-full rounded-full" />
      </button>
      <div
        className={cn(
          "flex h-full flex-1 flex-col justify-center gap-y-3 overflow-hidden",
          sidebarCollapsed && "lg:hidden",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="truncate text-xs text-[#abcdff]">
            {activeMusic?.title || "----"} | {activeMusic?.artist || "----"}
          </span>
          <span
            onClick={() => {
              audioElement.src = "";
              dispatch(handleCloseMusic());
              dispatch(updateStateField({ entity: "openMusicModal", value: false }));
            }}
            className="flex h-full w-[35px] items-center justify-center rounded-sm bg-[#c06262]"
          >
            <MdClose />
          </span>
        </div>
        <div className="flex items-center">
          <button className="mr-5">
            <IoPlaySkipBackSharp size={13} />
          </button>
          <button className="mr-5" onClick={handlePlayPauseMusic}>
            {musicIsPlaying && <IoMdPause size={13} />}
            {!musicIsPlaying && <IoMdPlay size={13} />}
          </button>
          <button>
            <IoPlaySkipForward size={13} />
          </button>
          {!!audioElement.duration && (
            <span className="ml-auto text-xs text-gray-300">{formatTime(audioElement.duration)}</span>
          )}
        </div>
        <input
          type="range"
          id="trackSong"
          min={0}
          max={Math.floor(audioElement.duration).toString()}
          value={trackValue}
          step={0.1}
          onChange={(e) => {
            audioElement.currentTime = Number(e.target.value);
          }}
          className="mt-1 h-[2px] w-full outline-none"
        />
      </div>
    </div>
  );
});

export default MusicPlayer;
