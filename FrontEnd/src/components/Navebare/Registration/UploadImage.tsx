import React from "react";
import uploadIcon from "../../../assets/images/upload-icon.png";
import Spinner from "../../Others/Spinner";

interface TypeProps {
  profilePicture: string | undefined;
  setGetFile: React.Dispatch<any>;
  filePercentage: number;
  uploading: boolean;
  paused: boolean;
}

const UploadImage = ({
  profilePicture,
  setGetFile,
  filePercentage,
  uploading,
  paused,
}: TypeProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center gap-3 w-[90%] sm:w-[60%] h-[140px] xs:h-[120px] xs:w-[50%] mx-auto">
      {!profilePicture ? (
        <>
          {!uploading ? (
            <div className="relative flex items-center justify-center w-[130px] h-[100px] xs:h-[90px]  mx-auto bg-[#20458a54] rounded-lg ">
              <input
                type="file"
                onChange={(e) =>
                  setGetFile(e.target.files ? e.target.files[0] : null)
                }
                className="absolute w-full h-full opacity-0 "
              />
              <img src={uploadIcon} className=" w-20 h-20 " />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="relative">
                <Spinner stop={paused} />
              </span>
            </div>
          )}
        </>
      ) : (
        <img
          src={profilePicture}
          alt="profile-picture"
          className="w-[130px] h-[105px] xs:w-[120px] xs:h-[100px] mx-auto rounded-lg border border-yellow-700"
        />
      )}
      {filePercentage > 0 && filePercentage < 100 && (
        <div className="relative rounded-full w-[80%] h-[6px] xs:h-[4px] bg-[#110e24] mx-auto">
          <span
            style={{ width: `${filePercentage}%`, height: "100%" }}
            className="transition-all absolute rounded-full bg-[#36df68]"
          ></span>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
