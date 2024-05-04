import { useEffect, useRef, useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import {
  showPopup,
  openModel,
  toggleThisEntity,
} from "../../../context/StateManeger";
import { makeRequest } from "../../../utils";
import { handleApiError } from "../../../utils/common";

import notificationSoundSrc from "../../../assets/images/notificationSound.wav";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { IoMdNotifications } from "react-icons/io";
import ApplyCoupon from "../../Others/ApplyCoupon";
import UserImage from "../../Others/UserImage";
import ProfileMenu from "../../Navebare/ProfileAccount/ProfileMenu";
import NotificationMenu from "../../Navebare/Notifications/NotificationMenu";
import { TypeNotifications } from "../../../types/notification";
import { useCloseMenuOnClickOutSide, useListenToEvent } from "../../../hooks";

const ProfileActions = () => {
  const { currentUser, openNotification } = useAppSelector(
    (state) => state.stateManeger
  );
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<TypeNotifications[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const notifySound = new Audio();
  notifySound.src = notificationSoundSrc;

  const numUnReaded = notifications.filter(
    (element) => element.isRead === false
  ).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      try {
        const response = await makeRequest.get("api/notifications");
        setNotifications(response.data);
      } catch (error) {
        dispatch(
          showPopup({
            status: true,
            message: handleApiError(error),
            type: "ERROR_GENERAL",
          })
        );
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  useListenToEvent<TypeNotifications>({
    eventToListen: "new-notification",
    onUpdate: (data) => {
      setNotifications((prev) => [...prev, data]);
      notifySound.play();
    },
  });

  useCloseMenuOnClickOutSide({
    menuRef: profileMenuRef,
    onClose: () => setOpenProfileMenu(false),
  });

  return (
    <>
      {currentUser && (
        <div className="relative flex items-center gap-4 sm:gap-1">
          <div className=" flex items-center rounded-md  gap-2 xs:gap-1 bg-[#04050a]">
            <button
              onClick={() => {
                dispatch(
                  openModel({ status: true, children: <ApplyCoupon /> })
                );
              }}
              className="text-2xl sm:text-xl text-[#8fee37ee] font-bold flex items-center justify-center  sm:p-[8px] p-[10px] rounded-s-md"
            >
              +
            </button>
            <span className=" whitespace-nowrap sm:text-[10px] p-[14px] tracking-wider font-bold border-l text-[#beababde] rounded-e-md">
              <span className="text-[#3de21c] mr-[3px]">
                {currentUser.points}
              </span>
              points
            </span>
          </div>
          <div
            onClick={() => setOpenProfileMenu(!openProfileMenu)}
            ref={profileMenuRef}
            className="bg-[#3a3e5877] flex gap-6 px-3 sm:px-[7px] sm:gap-[8px] items-center justify-center rounded-md sm:h-[40px] h-[50px] cursor-pointer"
          >
            <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
              <UserImage user={currentUser} />
            </div>
            <span className="text-[#c0c0ba] text-md sm:text-xs max-w-[120px] sm:max-w-[80px] sm:px-1 text-center whitespace-nowrap overflow-scroll scrollbar-none ">
              {currentUser.name}
            </span>
            <BsArrowDown className="sm:text-sm" />
            {openProfileMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#32324c] absolute top-14 sm:top-12 right-0 w-[65%] rounded-lg "
              >
                <ProfileMenu setOpenProfileMenu={setOpenProfileMenu} />
              </div>
            )}
          </div>
          <div
            onClick={() => {
              if (!openNotification) {
                dispatch(
                  toggleThisEntity({ entity: "openNotification", value: true })
                );
              } else {
                dispatch(
                  toggleThisEntity({ entity: "openNotification", value: false })
                );
              }
            }}
            className="flex items-center justify-center relative cursor-pointer sm:h-[38px] h-[45px] w-[45px] rounded-md bg-[#3a3e5877]"
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
        <div className="fixed top-[9%] right-0 w-[100vw] z-[4] h-[100vh] sm:w-full">
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
