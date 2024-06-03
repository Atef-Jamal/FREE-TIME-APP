import { useEffect } from "react";
import { MdOutlineClose, MdOutlineEditNotifications } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { showPopup, toggleThisEntity } from "../../../context/StateManeger";
import ReferrerNotify from "./ReferrerNotify";
import BuyFrameNotify from "./BuyFrameNotify";
import QuizTaskNotify from "./QuizTaskNotify";
import AnnouncementNotify from "./AnnouncementNotify";
import GuessCardNotify from "./GuessCardNotify";
import MentionNotify from "./MentionNotify";
import NotificationBuyMusic from "./BuyMusicNotify";
import EmailVerifiedNotify from "./EmailVerifiedNotify";
import { makeRequest } from "../../../utils";
import { handleApiError } from "../../../utils/common";

import Spinner from "../../Others/Spinner";
import { TypeNotifications } from "../../../types/notificationTypes";
import Empty from "../../Others/Empty";

const NotificationMenu = ({
  notifications,
  setNotifications,
  loadingNotifications,
}: {
  notifications: TypeNotifications[];
  loadingNotifications: boolean;
  setNotifications: React.Dispatch<React.SetStateAction<TypeNotifications[]>>;
}) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();

  const markNotificationasRead = async () => {
    try {
      await makeRequest.patch("api/notifications", { ddd: "ddd" });
      setNotifications((prev) => {
        return prev.map((item) => {
          if (item.isRead === false) {
            return { ...item, isRead: true };
          }
          return item;
        });
      });
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    }
  };

  useEffect(() => {
    const isThereNotificationUnReaded = notifications.some(
      (item) => item.isRead === false
    );
    if (isThereNotificationUnReaded) {
      markNotificationasRead();
    }
  }, [currentUser?._id]);

  return (
    <>
      <div
        onClick={() =>
          dispatch(
            toggleThisEntity({ entity: "openNotification", value: false })
          )
        }
        className="fixed top-[75px] sm:top-0 right-0 w-[100vw] h-[100vh] rounded-lg bg-[#01010779] "
      ></div>

      <div className=" absolute right-4 sm:right-[2.5%] top-0 w-[480px] sm:w-[95%] max-h-[85dvh] bg-[#2e2e4b] rounded-lg flex flex-col items-center gap-2 overflow-auto pb-2">
        <div className=" bg-[#2e2e4b] flex justify-between w-[96%] my-1 ">
          <h1 className="text-lg font-bold tracking-wider text-gray-300 border-b w-[50%] pb-2 flex items-center gap-2">
            <MdOutlineEditNotifications className="text-2xl" /> Notifications
          </h1>
          <MdOutlineClose
            onClick={() =>
              dispatch(
                toggleThisEntity({ entity: "openNotification", value: false })
              )
            }
            className="text-2xl"
          />
        </div>
        <div className="w-[96%] overflow-y-auto scrollbar-thin scrollbar-thumb-[#6d7c5a] scrollbar-track-[#251b3f85] flex flex-col gap-1">
          {loadingNotifications && (
            <div className="w-full h-full flex items-center justify-center">
              <Spinner className="w-8 h-8 border-[4px]" />
            </div>
          )}
          {!loadingNotifications &&
            notifications.length > 0 &&
            notifications
              .map((item) => {
                if (item.type === "QUIZ-APP") {
                  return (
                    <QuizTaskNotify
                      key={item._id}
                      _id={item._id}
                      isCollected={item.isCollected}
                      createdAt={item.createdAt}
                      prize={item.prize}
                    />
                  );
                }
                if (item.type === "EMAIL-VERIFIED") {
                  return (
                    <EmailVerifiedNotify
                      key={item._id}
                      _id={item._id}
                      createdAt={item.createdAt}
                      prize={item.prize}
                      isCollected={item.isCollected}
                    />
                  );
                }
                if (item.type === "BUY-FRAME") {
                  return (
                    <BuyFrameNotify
                      key={item._id}
                      frame={item.frame}
                      createdAt={item.createdAt}
                      updatedAt={item.updatedAt}
                    />
                  );
                }
                if (item.type === "MUSIC") {
                  return (
                    <NotificationBuyMusic
                      key={item._id}
                      musicTitle={item.musicTitle}
                      createdAt={item.createdAt}
                      price={item.price}
                      musicId={item.musicId}
                    />
                  );
                }
                if (item.type === "ANNOUNCEMENT") {
                  return (
                    <AnnouncementNotify
                      key={item._id}
                      announceContent={item.announceContent}
                      createdAt={item.createdAt}
                    />
                  );
                }
                if (item.type === "REFERRER") {
                  return (
                    <ReferrerNotify
                      key={item._id}
                      referredUser={item.referredUser}
                      createdAt={item.createdAt}
                      _id={item._id}
                      isCollected={item.isCollected}
                      prize={item.prize}
                    />
                  );
                }
                if (item.type === "GUESS-CARD") {
                  return (
                    <GuessCardNotify
                      key={item._id}
                      createdAt={item.createdAt}
                      _id={item._id}
                      isCollected={item.isCollected}
                      prize={item.prize}
                    />
                  );
                }
                if (item.type === "MENTION") {
                  return (
                    <MentionNotify
                      key={item._id}
                      messageLocation={item.messageLocation}
                      createdAt={item.createdAt}
                      mentionedUser={item.mentionedUser}
                    />
                  );
                }
              })
              .reverse()}
        </div>
        {notifications.length === 0 && (
          <Empty emptyText="Empty Notifications" />
          // <div className="flex flex-col items-center justify-center w-[90%] mb-4 ">
          //   <img alt={""} src={empty} className="w-[40px]" />
          //   <span className="text-gray-500 tracking-wider font-extrabold mt-4 text-sm">
          //     Empty
          //   </span>
          //   <span className="text-gray-500 tracking-wider font-bold text-sm ">
          //     You have No Notifications
          //   </span>
          // </div>
        )}
      </div>
    </>
  );
};

export default NotificationMenu;
