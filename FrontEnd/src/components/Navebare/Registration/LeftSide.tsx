import { SetStateAction } from "react";
import UploadImage from "./UploadImage";
import { TypeFormData } from "../../../types/othersTypes";
import { useTranslation } from "react-i18next";

interface TypeProps {
  setFormData: React.Dispatch<SetStateAction<TypeFormData>>;
  setImageIsUploading: React.Dispatch<SetStateAction<boolean>>;
  isSignInMode: boolean;
}
const LeftSide = ({
  setFormData,
  isSignInMode,
  setImageIsUploading,
}: TypeProps) => {
  const { t } = useTranslation("register");

  return (
    <div className="flex flex-col">
      {!isSignInMode && (
        <div className="w-full p-1 flex items-center justify-center mb-4">
          <UploadImage
            setImageIsUploading={setImageIsUploading}
            setFormData={setFormData}
          />
        </div>
      )}
      <span className="relative sign__up__bonus overflow-hidden tracking-wider bg-[#807f7fc0] text-[#d6d45b] flex items-center justify-center text-xl lg:text-sm h-12 mb-4">
        {t("Sign Up Bonus")}
      </span>
      <div>
        <p className="text-center mb-2 text-white font-[400]">
          {t("1 Create an account")}
        </p>
        <p className="text-center text-white font-[400] mr-4">
          {t("2 Open the free time and win up to $250!")}
        </p>
      </div>
      <h1 className="text-center font-bold text-[#9c84dfc9] text-xl mr-4 mt-4">
        {t("This case contains 4 possible winning amounts.")}
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
