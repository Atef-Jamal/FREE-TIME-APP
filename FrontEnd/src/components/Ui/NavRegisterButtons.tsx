import { ImKey2 } from "react-icons/im";
import { showModal, updateThisEntity } from "../../context/StateManeger";
import { BsFillPersonFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { useTranslation } from "react-i18next";

import RegisterationForm from "../Shared/Modals/RegisterModal/RegisterationForm";

const NavRegisterButtons = () => {
  const isSignInMode = useAppSelector((state) => state.stateManeger.isSignInMode);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("navbar");

  const handleOpenRegisterModal = () => {
    if (!isSignInMode) dispatch(updateThisEntity({ entity: "isSignInMode", value: true }));
    if (isSignInMode) dispatch(updateThisEntity({ entity: "isSignInMode", value: false }));
    dispatch(
      showModal({
        children: <RegisterationForm />,
      }),
    );
  };

  return (
    <div className="flex h-full items-center gap-x-1 sm:gap-x-2">
      <button
        className="flex h-full items-center gap-x-3 rounded-md border border-gray-500 bg-[#3b3b7eef] px-6 text-sm font-bold tracking-wide text-white"
        onClick={handleOpenRegisterModal}
      >
        <BsFillPersonFill />
        {t("Login")}
      </button>
      <button
        onClick={handleOpenRegisterModal}
        className="flex h-full items-center gap-x-3 rounded-md border border-gray-500 bg-[#01D676] px-6 text-sm font-bold tracking-wide text-black"
      >
        <ImKey2 />
        {t("Register")}
      </button>
    </div>
  );
};

export default NavRegisterButtons;
