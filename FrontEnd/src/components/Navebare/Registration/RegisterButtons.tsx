import { ImKey2 } from "react-icons/im";
import { openModel, updateThisEntity } from "../../../context/StateManeger";
import { BsFillPersonFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { useTranslation } from "react-i18next";
import RegisterationForm from "./RegisterationForm";

const RegisterButtons = () => {
  const isSignInMode = useAppSelector((state) => state.stateManeger.isSignInMode);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("navbar");
  return (
    <div className="h-full flex items-center gap-2 xs:gap-1 overflow-scroll scrollbar-none">
      <button
        onClick={() => {
          if (!isSignInMode) dispatch(updateThisEntity({ entity: "isSignInMode", value: true }));
          dispatch(
            openModel({
              status: true,
              children: <RegisterationForm />,
            }),
          );
        }}
        className=" flex items-center justify-center gap-3 sm:gap-2 rounded-md text-[#ebeaea] bg-[#3b3b7eef] font-bold border border-gray-500 px-7 h-full tracking-wider sm:px-3 sm:text-sm"
      >
        <BsFillPersonFill className="text-xl sm:text-lg" />
        {t("sign In")}
      </button>
      <button
        onClick={() => {
          if (isSignInMode) dispatch(updateThisEntity({ entity: "isSignInMode", value: false }));
          dispatch(
            openModel({
              status: true,
              children: <RegisterationForm />,
            }),
          );
        }}
        className=" flex items-center justify-center gap-3 sm:gap-2 rounded-md text-[#ffffff] bg-[#01D676] font-bold border border-gray-500 px-6 sm:px-3 h-full  tracking-wider sm:text-sm"
      >
        <ImKey2 />
        {t("sign Up")}
      </button>
    </div>
  );
};

export default RegisterButtons;
