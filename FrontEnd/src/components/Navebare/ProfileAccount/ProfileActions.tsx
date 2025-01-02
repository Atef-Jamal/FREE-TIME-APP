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
import { TypeNotifications } from "../../../types/notificationTypes";
import { useListenToSocketEvents } from "../../../hooks";
import { FaPlus } from "react-icons/fa6";

const ProfileActions = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const openNotification = useAppSelector((state) => state.stateManeger.openNotification);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<TypeNotifications[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const dispatch = useAppDispatch();

  const notifySound = new Audio();
  notifySound.src = notificationSoundSrc;

  const numUnReaded = notifications.filter((element) => element.isRead === false).length;

  const handleAddNewNotification = (data: TypeNotifications) => {
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
    <>
      {currentUser && (
        <div className="relative h-full flex items-center justify-between w-[500px] sm:w-[320px]">
          <div className="w-[28%] h-full flex items-center rounded-md bg-[#04050a] overflow-scroll scrollbar-none">
            <button
              onClick={() => {
                dispatch(openModel({ status: true, children: <ApplyCoupon /> }));
              }}
              className="w-1/3 h-full flex items-center justify-center"
            >
              <FaPlus />
            </button>
            <span className="border-l h-full flex flex-col items-center justify-center flex-1">
              <span className="text-[#3de21c] -mb-[1px] text-lg sm:text-xs">{currentUser.points}</span>
              <span className="sm:text-[9px] text-xs text-[#c2bebe] ">points</span>
            </span>
          </div>
          <div
            onClick={() => setOpenProfileMenu(!openProfileMenu)}
            className="cursor-pointer w-[55%] h-full bg-[#3a3e58b7] flex items-center justify-around rounded-md "
          >
            <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
              <UserImage user={currentUser} />
            </div>
            <span className="text-[#c0c0ba] text-md sm:text-xs max-w-[120px] sm:max-w-[80px] sm:px-1 text-center whitespace-nowrap overflow-scroll scrollbar-none ">
              {currentUser.name}
            </span>
            <BsArrowDown className="sm:text-sm" />
            {openProfileMenu && (
              <div className="bg-[#32324c] absolute top-[60px] sm:top-12 right-7 sm:right-4 w-[65%] rounded-lg">
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
            className="flex items-center justify-center relative cursor-pointer h-full w-[14%] rounded-md bg-[#3a3e58b7]"
          >
            {numUnReaded > 0 && (
              <span className="w-[18px] h-[18px] flex items-center justify-center absolute top-1 right-1 rounded-full bg-red-600 text-xs">
                {numUnReaded}
              </span>
            )}
            <IoMdNotifications className="cursor-pointer text-2xl" />
          </div>
        </div>
      )}
      {openNotification && (
        <div className="fixed top-[70px] sm:top-[53px] right-0 w-[100vw] z-[4] h-[100vh] sm:w-full">
          <NotificationMenu
            loadingNotifications={loadingNotifications}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </div>
      )}
    </>
  );
};

export default ProfileActions;
