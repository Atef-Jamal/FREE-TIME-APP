import { FaAngleLeft } from "react-icons/fa";
import { IoMdPause } from "react-icons/io";
import { IoMdPlay } from "react-icons/io";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import { useEffect, useState } from "react";
import { avatar } from "../../assets";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { resetCurrentSong, toggleThisEntity } from "../../context/StateManeger";
import { MdClose } from "react-icons/md";

const MusicPlayer = () => {
  const [expand, setExpand] = useState(false);
  const [trackValue, setTrackValue] = useState(0);
  const [songTime, setSongTime] = useState(0);
  const { isPlaying, currentSong } = useAppSelector(
    (state) => state.stateManeger
  );

  const dispatch = useAppDispatch();
  const handlePlay = () => {
    const audioElement = document.getElementById("audioid") as HTMLAudioElement;
    dispatch(toggleThisEntity({ entity: "isPlaying", value: true }));
    audioElement.play();
  };

  const handlePause = () => {
    const audioElement = document.getElementById("audioid") as HTMLAudioElement;
    dispatch(toggleThisEntity({ entity: "isPlaying", value: false }));
    audioElement.pause();
  };

  const handleClose = () => {
    const audioElement = document.getElementById("audioid") as HTMLAudioElement;
    audioElement.src = "";
    dispatch(toggleThisEntity({ entity: "isPlaying", value: false }));
    dispatch(resetCurrentSong());
    dispatch(toggleThisEntity({ entity: "openMusicModal", value: false }));
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    return formattedTime;
  };

  useEffect(() => {
    const audioElement = document.getElementById("audioid") as HTMLAudioElement;
    const func = (e: any) => {
      setTrackValue(e.target.currentTime);
      setSongTime(Math.floor(audioElement.duration));
    };

    audioElement.addEventListener("timeupdate", func);
    return () => audioElement.removeEventListener("change", func);
  }, []);

  return (
    <div
      className={`transition-all ${
        !expand ? "translate-x-0" : "-translate-x-[90%]"
      } w-[260px] sm:w-[230px] h-[80%] sm:h-full rounded-lg xs:rounded-s-none xs:absolute left-0 top-0 flex items-center justify-between  bg-[#476872] mt-2 sm:mt-0 `}
    >
      <div className="flex justify-between h-full w-full xs:px-1 px-3 ">
        <div className=" w-full flex justify-between items-center gap-2 ">
          <span
            className={`transition-all  ${
              isPlaying ? "animate-spin " : ""
            } w-10 h-10 rounded-full border-2 border-l-[#ffae45] border-t-[#222770] border-r-[#cef03a] border-b-[#192461]`}
          >
            <img
              src={currentSong?.album.cover || avatar}
              alt=""
              className="w-full h-full rounded-full"
            />
          </span>
          <div className="w-[75%] h-full flex flex-col justify-evenly">
            <span className=" w-full flex items-center justify-between">
              <span className="w-[120px] text-xs text-[#abcdff] truncate font-bold ">
                {currentSong?.title || "Song name"}
                <span className="text-[#e6f74e] font-extrabold mx-2">|</span>
                {currentSong?.artist.name || "Artist name"}
              </span>
              <span
                onClick={handleClose}
                className="xs:hidden w-5 h-5 flex items-center justify-center bg-[#c96d6d] border border-gray-400 ml-1"
              >
                <MdClose />
              </span>
            </span>
            <div className="flex items-center gap-5 -mt-[6px] ml-0 ">
              <span>
                <IoPlaySkipBackSharp />
              </span>
              {!isPlaying ? (
                <span onClick={handlePlay}>
                  <IoMdPlay />
                </span>
              ) : (
                <span onClick={handlePause}>
                  <IoMdPause />
                </span>
              )}
              <span>
                <IoPlaySkipForward />
              </span>
              {songTime > 0 && (
                <span className="text-xs text-gray-300">
                  {formatTime(songTime)}
                </span>
              )}
            </div>
            <input
              type="range"
              id="trackSong"
              min={0}
              max={songTime.toString()}
              value={trackValue}
              onChange={(e) => {
                const audioElement = document.getElementById(
                  "audioid"
                ) as HTMLAudioElement;
                audioElement.currentTime = Number(e.target.value);
              }}
              className="w-full h-[4px] outline-none"
            />
          </div>
        </div>
        <audio
          onEnded={() => {
            dispatch(toggleThisEntity({entity: 'isPlaying', value: false}));
          }}
          id="audioid"
          src={undefined}
        />
      </div>
      <span
        onClick={() => setExpand((prev) => !prev)}
        className="hidden h-full bg-[#5aec7f] w-[30px] xs:flex flex-col items-center justify-center"
      >
        <span
          onClick={handleClose}
          className="w-full h-[40%] flex items-center justify-center bg-[#c96d6d] "
        >
          <MdClose className="text-2xl" />
        </span>
        <FaAngleLeft className="text-2xl w-full h-[60%]" />
      </span>
    </div>
  );
};

export default MusicPlayer;
