import { lazy, Suspense } from "react";
import { resetModel, selectModal } from "../../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../../context/hooks";
import Spinner from "../Common/Spinner";

const RegisterationForm = lazy(() => import("./RegisterModal/RegisterationForm"));
const ApplyCoupon = lazy(() => import("./ApplyCouponModal/ApplyCoupon"));
const Notifications = lazy(() => import("./NotificationsModal/Notifications"));
const Search = lazy(() => import("./SearchModal/Search"));
const ProfileSettings = lazy(() => import("./ProfileSettingModal/ProfileSettings"));

const Modal = () => {
  const modal = useAppSelector(selectModal);
  const dispatch = useAppDispatch();

  const closeModel = () => dispatch(resetModel());

  if (!modal) return;

  let modalContent = null;

  switch (modal) {
    case "register-modal":
      modalContent = <RegisterationForm />;
      break;
    case "apply-bonus-code-modal":
      modalContent = <ApplyCoupon />;
      break;
    case "notifications-modal":
      modalContent = <Notifications />;
      break;
    case "search-modal":
      modalContent = <Search />;
      break;
    case "profile-setting-modal":
      modalContent = <ProfileSettings />;
      break;

    default:
      break;
  }

  return (
    <div className="fixed z-[11] flex h-[100dvh] w-[100dvw] items-center justify-center">
      <div
        onClick={closeModel}
        className="absolute z-[-1] h-full w-full backdrop-blur-sm backdrop-brightness-[0.6]"
      ></div>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Spinner className="h-14 w-14 border-[4px]" />
          </div>
        }
        children={modalContent}
      />
    </div>
  );
};

export default Modal;
