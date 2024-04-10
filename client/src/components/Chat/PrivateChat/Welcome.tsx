import React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

interface TypeProps {
  setResized: React.Dispatch<React.SetStateAction<boolean>>;
}

const Welcome = ({ setResized }: TypeProps) => {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <IoChatboxEllipsesOutline className="text-6xl" />
      <p className="text-2xl text-[#cf9d9d59] font-extrabold text-center">
        START YOUR CHAT NOW
      </p>
      <p className="text-lg text-[#cf9d9d59] font-extrabold text-center">
        WITH MORE SECURITY AND PRIVACY AND MuCH MORE
        <br />
        <button
          onClick={() => setResized(false)}
          className=" text-lg text-[#9063e481] font-extrabold underline"
        >
          Select a Friend
        </button>
      </p>
    </div>
  );
};

export default Welcome;
