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
    <div className="ml-auto flex items-center gap-2">
      <button
        className="flex items-center justify-center gap-3 rounded-md border border-gray-500 bg-[#3b3b7eef] px-6 py-2 text-sm font-[600] tracking-wide text-white"
        onClick={() => {
          if (!isSignInMode) dispatch(updateThisEntity({ entity: "isSignInMode", value: true }));
          dispatch(
            openModel({
              status: true,
              children: <RegisterationForm />,
            }),
          );
        }}
      >
        <BsFillPersonFill />
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
        className="flex items-center justify-center gap-3 rounded-md border border-gray-500 bg-[#01D676] px-6 py-2 text-sm font-[600] tracking-wide text-black"
      >
        <ImKey2 />
        {t("Register")}
      </button>
    </div>
  );
};

export default RegisterButtons;
