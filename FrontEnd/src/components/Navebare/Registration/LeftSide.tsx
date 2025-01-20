import { SetStateAction } from "react";
import UploadImage from "./UploadImage";
import { IFormData } from "../../../types/othersTypes";
import { useTranslation } from "react-i18next";

interface IProps {
  setFormData: React.Dispatch<SetStateAction<IFormData>>;
  setImageIsUploading: React.Dispatch<SetStateAction<boolean>>;
  isSignInMode: boolean;
}
const LeftSide = ({ setFormData, isSignInMode, setImageIsUploading }: IProps) => {
  const { t } = useTranslation("register");

  return (
    <div className="flex flex-col">
      {!isSignInMode && (
        <div className="mb-4 flex w-full items-center justify-center p-1">
          <UploadImage setImageIsUploading={setImageIsUploading} setFormData={setFormData} />
        </div>
      )}
      <span className="sign__up__bonus relative mb-4 flex h-12 items-center justify-center overflow-hidden bg-[#807f7fc0] text-xl tracking-wider text-[#d6d45b] lg:text-sm">
        {t("Sign Up Bonus")}
      </span>
      <div>
        <p className="mb-2 text-center font-[400] text-white">{t("1 Create an account")}</p>
        <p className="mr-4 text-center font-[400] text-white">
          {t("2 Open the free time and win up to $250!")}
        </p>
      </div>
      <h1 className="mr-4 mt-4 text-center text-xl font-bold text-[#9c84dfc9]">
        {t("This case contains 4 possible winning amounts.")}
      </h1>
      <div className="mt-4 flex flex-wrap gap-4">
        <span className="flex h-10 w-[40%] items-center justify-center rounded-md bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] text-white">
          $250,00
        </span>
        <span className="flex h-10 w-[40%] items-center justify-center rounded-md bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] text-white">
          $2,50
        </span>
        <span className="flex h-10 w-[40%] items-center justify-center rounded-md bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] text-white">
          $0.25
        </span>
        <span className="flex h-10 w-[40%] items-center justify-center rounded-md bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] text-white">
          $0,05
        </span>
      </div>
    </div>
  );
};

export default LeftSide;
