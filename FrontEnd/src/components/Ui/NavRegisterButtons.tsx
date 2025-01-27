import { ImKey2 } from "react-icons/im";
import { showModal, updateThisEntity } from "../../context/appStateSlice";
import { BsFillPersonFill } from "react-icons/bs";
import { useAppDispatch } from "../../context/hooks";
import { useTranslation } from "react-i18next";

const NavRegisterButtons = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("navbar");

  const handleOpenLoginModal = () => {
    dispatch(updateThisEntity({ entity: "isSignInMode", value: true }));
    dispatch(showModal("register-modal"));
  };

  const handleOpenRegisterModal = () => {
    dispatch(updateThisEntity({ entity: "isSignInMode", value: false }));
    dispatch(showModal("register-modal"));
  };

  return (
    <div className="flex h-full items-center gap-x-1 sm:gap-x-2">
      <button
        className="flex h-full items-center gap-x-3 rounded-md border border-gray-500 bg-[#3b3b7eef] px-6 text-sm font-bold tracking-wide text-white"
        onClick={handleOpenLoginModal}
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
