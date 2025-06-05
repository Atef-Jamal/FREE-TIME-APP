import { SetStateAction } from "react";
import UploadImage from "../../Common/UploadImage";
import type { IFormData } from "../../../../types";
import { useTranslation } from "react-i18next";

interface IProps {
  formData: IFormData;
  setFormData: React.Dispatch<SetStateAction<IFormData>>;
  isSignInMode: boolean;
}
const LeftSide = ({ formData, setFormData, isSignInMode }: IProps) => {
  const { t } = useTranslation("register");

  return (
    <div className="flex h-full flex-col gap-y-2">
      {!isSignInMode && (
        <div className="flex w-full items-center justify-center p-1">
          <UploadImage formData={formData} setFormData={setFormData} />
        </div>
      )}
      <div className="relative flex items-center justify-center">
        <div
          style={{
            transform: "perspective(100px) rotateX(140deg)",
          }}
          className="mx-auto flex h-12 w-[85%] items-center justify-center overflow-hidden bg-[#807f7fc0]"
        ></div>
        <p className="absolute top-1 text-xl tracking-wider text-[#d6d45b]"> {t("Sign Up Bonus")}</p>
      </div>
      <p className="text-center font-[400] text-[#e4dddd]">
        {t("1 Create an account, 2 Open the free time and win up to $250!")}
      </p>
      <h1 className="text-center text-lg font-bold text-[#9c84dfc9]">
        {t("This case contains 4 possible winning amounts.")}
      </h1>
      <div className="mt-auto grid grid-cols-2 gap-4">
        <span className="flex h-10 items-center justify-center rounded-md bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] text-white">
          $250,00
        </span>
        <span className="flex h-10 items-center justify-center rounded-md bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] text-white">
          $2,50
        </span>
        <span className="flex h-10 items-center justify-center rounded-md bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] text-white">
          $0.25
        </span>
        <span className="flex h-10 items-center justify-center rounded-md bg-gradient-to-b from-[#0aec1d94] to-[#2f3c55cc] text-white">
          $0,05
        </span>
      </div>
    </div>
  );
};

export default LeftSide;
