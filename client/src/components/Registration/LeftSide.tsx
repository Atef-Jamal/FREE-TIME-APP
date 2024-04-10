import React from "react";
import UploadImage from "./UploadImage";
// import { PiPlayPause } from "react-icons/pi";
import { FaPauseCircle } from "react-icons/fa";
import { IoMdPlay } from "react-icons/io";

interface TypeProps {
  profilePicture: string | undefined;
  setGetFile: React.Dispatch<any>;
  filePercentage: number;
  uploading: boolean;
  handleCancelUploading: () => void;
  isSignIn: boolean;
  paused: boolean;
  handlePuase: () => void;
  handleResume: () => void;
}

const LeftSide = ({
  profilePicture,
  setGetFile,
  filePercentage,
  uploading,
  handleCancelUploading,
  paused,
  handlePuase,
  handleResume,
  isSignIn,
}: TypeProps) => {
  return (
    <div className="flex flex-col w-[40%] sm:hidden ">
      {!isSignIn && (
        <>
          <UploadImage
            paused={paused}
            uploading={uploading}
            setGetFile={setGetFile}
            profilePicture={profilePicture}
            filePercentage={filePercentage}
          />
          {uploading && (
            <div className="py-1 px-2 self-center mb-8 bg-[#61a3223b] rounded-md flex items-center justify-between border border-gray-500 w-[80%]">
              Uploading...
              {paused && (
                <button onClick={handleResume}>
                  <IoMdPlay className="text-xl" />
                </button>
              )}
              {!paused && (
                <button onClick={handlePuase}>
                  <FaPauseCircle className="text-xl" />
                </button>
              )}
              <button
                onClick={handleCancelUploading}
                className="py-1 px-2 bg-[#71c04d] rounded-md"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
      <span className="relative sign__up__bonus overflow-hidden tracking-wider bg-[#807f7fc0] text-[#d6d45b] flex items-center justify-center text-xl lg:text-sm h-12 mb-4">
        Sign Up Bonus
      </span>
      <div>
        <p className="text-center mb-2 text-white font-[400]">
          1 Create an account
        </p>
        <p className="text-center text-white font-[400] mr-4">
          2 Open the free time and win up to $250!
        </p>
      </div>
      <h1 className="text-center font-bold text-[#9c84dfc9] text-xl mr-4 mt-4">
        This case contains 4 possible winning amounts.
      </h1>
      <div className="flex gap-4 flex-wrap mt-4">
        <span className="w-[40%] h-10 rounded-md  text-white bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] flex items-center justify-center">
          $250,00
        </span>
        <span className="w-[40%] h-10 rounded-md  text-white bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] flex items-center justify-center">
          $2,50
        </span>
        <span className="w-[40%] h-10 rounded-md  text-white bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] flex items-center justify-center">
          $0.25
        </span>
        <span className="w-[40%] h-10 rounded-md  text-white bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] flex items-center justify-center">
          $0,05
        </span>
      </div>
    </div>
  );
};

export default LeftSide;
