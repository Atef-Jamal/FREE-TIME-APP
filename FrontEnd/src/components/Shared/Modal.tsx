import { lazy, Suspense } from "react";
import { resetModel, selectModal } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import Spinner from "./Spinner";

const RegisterationForm = lazy(() => import("../../features/auth/components/RegisterFormModel"));
const ApplyCoupon = lazy(() => import("../../features/rewards/components/ApplyCouponModal"));
const Notifications = lazy(() => import("../../features/notifications/components/NotificationsModal"));
const Search = lazy(() => import("../../features/search/components/SearchModal"));
const ProfileSettings = lazy(() => import("../../features/my-profile/components/ProfileSettingModal"));

export type IModal =
  | "register-modal"
  | "search-modal"
  | "apply-bonus-code-modal"
  | "notifications-modal"
  | "profile-setting-modal"
  | null;

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
