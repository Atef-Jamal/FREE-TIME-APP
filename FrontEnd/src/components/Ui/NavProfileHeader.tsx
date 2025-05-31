import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BsArrowDown } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { showModal } from "../../context/appStateSlice";
import notificationSoundSrc from "../../assets/images/notificationSound.wav";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { IoMdNotifications } from "react-icons/io";
import ProfileMenu from "./ProfileMenu";
import { INotifications } from "../../types/notificationTypes";
import { useListenToSocketEvents } from "../../hooks/useListenToSocketEvents";
import UserImage from "../Shared/Common/UserImage";
import { useFetchNotifications } from "../../tanstackQuery/queryFetch";
import { addNewNotificationCache } from "../../tanstackQuery/queryCache";

const notifySound = new Audio(notificationSoundSrc);

const NavProfileHeader = () => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const userAuth = currentUserStatus === "authenticated";

  const { data: notifications } = useFetchNotifications({ userAuth });

  const numUnReaded = notifications?.filter((element) => element.isRead === false).length;

  const handleAddNewNotification = useCallback(
    (newNotification: INotifications) => {
      addNewNotificationCache({ queryClient, newNotification });
      notifySound.play();
    },
    [queryClient],
  );

  const handleOpenNotificatioModal = () => {
    dispatch(showModal("notifications-modal"));
  };

  const events = useMemo(() => ["new-notification"], []);
  const handlers = useMemo(() => [handleAddNewNotification], [handleAddNewNotification]);

  useListenToSocketEvents({
    eventsToListen: events,
    handlers: handlers,
  });

  return (
    <div className="relative flex h-full items-center gap-x-1 sm:gap-x-2">
      <div className="flex h-full items-center overflow-auto rounded-md bg-[#000000] scrollbar-none">
        <button
          onClick={() => {
            dispatch(showModal("apply-bonus-code-modal"));
          }}
          className="px-2"
        >
          <FaPlus />
        </button>
        <span className="pr-2 text-xs text-[#3de21c] sm:text-lg">{currentUser?.points}</span>
      </div>
      <div
        onClick={() => setOpenProfileMenu(!openProfileMenu)}
        className="relative flex h-full cursor-pointer items-center gap-x-4 rounded-md bg-[#3a3e58b7] px-2 sm:px-4"
      >
        <div className="h-[25px] w-[30px] sm:h-[30px] sm:w-[35px]">
          <UserImage user={currentUser} />
        </div>
        <span className="max-w-[80px] overflow-auto whitespace-nowrap text-center text-xs text-[#c0c0ba] scrollbar-none sm:max-w-[120px] sm:text-base">
          {currentUser?.name}
        </span>
        <BsArrowDown className="text-sm sm:text-base" />
        {openProfileMenu && (
          <div className="absolute left-0 top-[105%] z-[100] w-[205px] rounded-lg bg-[#32324c] sm:w-[270px]">
            <ProfileMenu setOpenProfileMenu={setOpenProfileMenu} />
          </div>
        )}
      </div>
      <div
        onClick={handleOpenNotificatioModal}
        className="relative flex h-full cursor-pointer items-center justify-center rounded-md bg-[#3a3e58b7] px-2 sm:px-4"
      >
        {numUnReaded && numUnReaded > 0 ? (
          <span className="absolute right-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-600 text-xs">
            {numUnReaded}
          </span>
        ) : undefined}
        <IoMdNotifications className="cursor-pointer text-2xl" />
      </div>
    </div>
  );
};

export default NavProfileHeader;
