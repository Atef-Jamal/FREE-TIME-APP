import { useEffect, useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import { showPopup, openModel, updateThisEntity } from "../../../context/StateManeger";
import { makeRequest } from "../../../utils";
import { handleApiError } from "../../../utils/common";
import notificationSoundSrc from "../../../assets/images/notificationSound.wav";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { IoMdNotifications } from "react-icons/io";
import ApplyCoupon from "../../Others/ApplyCoupon";
import UserImage from "../../Others/UserImage";
import ProfileMenu from "./ProfileMenu";
import NotificationMenu from "../Notifications/NotificationMenu";
import { INotifications } from "../../../types/notificationTypes";
import { useListenToSocketEvents } from "../../../hooks";
import { FaPlus } from "react-icons/fa6";

const ProfileActions = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const openNotification = useAppSelector((state) => state.stateManeger.openNotification);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const dispatch = useAppDispatch();

  const notifySound = new Audio();
  notifySound.src = notificationSoundSrc;

  const numUnReaded = notifications.filter((element) => element.isRead === false).length;

  const handleAddNewNotification = (data: INotifications) => {
    setNotifications((prev) => {
      const exists = prev.find((notify) => notify._id === data._id);
      if (exists) {
        return prev
          .map((notify) => {
            if (notify._id === data._id) return data;
            return notify;
          })
          .sort((a, b) => {
            if (a._id === data._id) return -1;
            if (b._id === data._id) return 1;
            return 0;
          });
      }
      return [data, ...prev];
    });
    notifySound.play();
  };

  useEffect(() => {
    if (!currentUser?._id) return;
    const fetchNotifications = async () => {
      try {
        const response = await makeRequest.get("api/notifications/my-notifications");
        setNotifications(response.data);
      } catch (error) {
        dispatch(
          showPopup({
            message: handleApiError(error),
            type: "ERROR_GENERAL",
          }),
        );
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchNotifications();
  }, [currentUser?._id, dispatch]);

  useListenToSocketEvents({
    eventsToListen: ["new-notification"],
    handlers: [handleAddNewNotification],
  });

  return (
    <div className="relative flex h-10 items-center gap-x-1 sm:gap-x-2 lg:h-11">
      <div className="flex h-full items-center overflow-scroll rounded-md bg-[#000000] scrollbar-none">
        <button
          onClick={() => {
            dispatch(openModel({ status: true, children: <ApplyCoupon /> }));
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
        <span className="max-w-[80px] overflow-scroll whitespace-nowrap text-center text-xs text-[#c0c0ba] scrollbar-none sm:max-w-[120px] sm:text-base">
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
        onClick={() => {
          if (!openNotification) {
            dispatch(updateThisEntity({ entity: "openNotification", value: true }));
          } else {
            dispatch(updateThisEntity({ entity: "openNotification", value: false }));
          }
        }}
        className="relative flex h-full cursor-pointer items-center justify-center rounded-md bg-[#3a3e58b7] px-2 sm:px-4"
      >
        {numUnReaded > 0 && (
          <span className="absolute right-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-600 text-xs">
            {numUnReaded}
          </span>
        )}
        <IoMdNotifications className="cursor-pointer text-2xl" />
      </div>
      {openNotification && (
        <div className="fixed right-0 top-[70px] z-[4] h-[100vh] w-[100vw] sm:top-[53px] sm:w-full">
          <NotificationMenu
            loadingNotifications={loadingNotifications}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileActions;
