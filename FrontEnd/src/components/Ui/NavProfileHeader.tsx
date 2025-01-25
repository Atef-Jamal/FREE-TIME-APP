import { useState } from "react";
import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import { BsArrowDown } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { showModal } from "../../context/StateManeger";
import { fetchMyNotifications } from "../../utils";
import notificationSoundSrc from "../../assets/images/notificationSound.wav";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { IoMdNotifications } from "react-icons/io";
import ProfileMenu from "./ProfileMenu";
import { ICashedNotificaions, INotifications } from "../../types/notificationTypes";
import { useListenToSocketEvents } from "../../hooks";
import Notifications from "../Shared/Modals/NotificationsModal/Notifications";
import ApplyCoupon from "../Shared/Modals/ApplyCouponModal/ApplyCoupon";
import UserImage from "../Shared/Common/UserImage";

const NavProfileHeader = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const notifySound = new Audio();
  notifySound.src = notificationSoundSrc;

  const {
    data: notifications,
    status,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: currentUser?._id ? fetchMyNotifications : skipToken,
    staleTime: 1000 * 60 * 60,
  });

  const numUnReaded = notifications?.filter((element) => element.isRead === false).length;

  const handleAddNewNotification = (data: INotifications) => {
    queryClient.setQueryData(
      ["notifications"],
      (previous: ICashedNotificaions): ICashedNotificaions | undefined => {
        if (!previous) return;
        return [data, ...previous];
      },
    );
    notifySound.play();
  };

  useListenToSocketEvents({
    eventsToListen: ["new-notification"],
    handlers: [handleAddNewNotification],
  });

  const handleOpenNotificatioModal = () => {
    dispatch(
      showModal({
        children: (
          <Notifications
            notifications={notifications}
            isLoading={status === "pending"}
            error={error?.response?.data.error}
          />
        ),
      }),
    );
  };

  return (
    <div className="relative flex h-full items-center gap-x-1 sm:gap-x-2">
      <div className="scrollbar-none flex h-full items-center overflow-auto rounded-md bg-[#000000]">
        <button
          onClick={() => {
            dispatch(showModal({ children: <ApplyCoupon /> }));
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
        <span className="scrollbar-none max-w-[80px] overflow-auto whitespace-nowrap text-center text-xs text-[#c0c0ba] sm:max-w-[120px] sm:text-base">
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
