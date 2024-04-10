import { useEffect } from "react";
import { empty } from "../../../assets";
import { CgCloseR } from "react-icons/cg";
import { MdOutlineEditNotifications } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { toggleNotifications } from "../../../context/StateManeger";
import { TypeNotifications } from "../../../types";
import ReferrerNotify from "./ReferrerNotify";
import BuyFrameNotify from "./BuyFrameNotify";
import QuizTaskNotify from "./QuizTaskNotify";
import AnnouncementNotify from "./AnnouncementNotify";
import GuessCardNotify from "./GuessCardNotify";
import MentionNotify from "./MentionNotify";
import NotificationBuyMusic from "./BuyMusicNotify";
import EmailVerifiedNotify from "./EmailVerifiedNotify";
import axios from "axios";
import { Skeleton } from "../..";

const NotificationMenu = ({
  notifications,
  loadingNotifications,
}: {
  notifications: TypeNotifications[];
  loadingNotifications: boolean;
}) => {
  const { currentUser, token } = useAppSelector((state) => state.stateManeger);

  const dispatch = useAppDispatch();

  if (!currentUser) return;

  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const markNotificationasRead = async () => {
      try {
        await axios.patch(
          "http://localhost:3000/api/notifications",
          { ddd: "ddd" },
          {
            headers,
          }
        );
        notifications.forEach((item) => (item.isRead = true));
      } catch (error) {
        console.log(error);
      }
    };

    const isThereNotificationUnReaded = notifications.some(
      (item) => item.isRead === false
    );

    if (isThereNotificationUnReaded) {
      markNotificationasRead();
    }
  }, [currentUser, notifications]);

  return (
    <div className=" fixed top-[9%] right-0 w-[100vw] z-[4] h-[100vh] sm:w-full">
      <div
        onClick={() => dispatch(toggleNotifications(false))}
        className="fixed top-[73px] sm:top-0 right-0 w-[100vw] h-[100vh] rounded-lg flex flex-col items-center gap-6 py-6 bg-[#01010779] sm:w-full"
      ></div>

      <div className=" absolute right-4 sm:right-2 top-0 w-[480px] sm:w-[93.5%] max-h-[85dvh] bg-[#2e2e4b] rounded-lg flex flex-col items-center gap-2 overflow-auto pb-4 ">
        <div className=" bg-[#2e2e4b] flex justify-between w-[93%] my-2 ">
          <h1 className="text-lg font-bold tracking-wider text-gray-300 border-b w-[50%] pb-2 flex items-center gap-2">
            <MdOutlineEditNotifications className="text-2xl" /> Notifications
          </h1>
          <CgCloseR
            onClick={() => dispatch(toggleNotifications(false))}
            className="text-2xl bg-[#222]"
          />
        </div>
        <div className="w-[93%] overflow-y-auto scrollbar-thin scrollbar-thumb-[#6d7c5a] scrollbar-track-[#251b3f85] pr-2 flex flex-col gap-[6px]">
          {loadingNotifications && (
            <>
              <div className="w-full  p-2 flex flex-col items-center gap-2 bg-[#1010308e] rounded-md mb-2">
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2 w-full">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-2 w-[150px] rounded-sm" />
                      <Skeleton className="h-2 w-[120px] rounded-sm" />
                    </div>
                  </div>
                  <Skeleton className="w-[80%] mx-auto h-2 rounded-sm" />
                  <Skeleton className="w-[80%] mx-auto h-2 rounded-sm" />
                </div>
              </div>
              <div className="w-full  p-2 flex flex-col items-center gap-2 bg-[#1010308e] rounded-md mb-2">
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2 w-full">
                    <Skeleton className="h-8 w-8  rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-2 w-[150px] rounded-sm" />
                      <Skeleton className="h-2 w-[120px] rounded-sm" />
                    </div>
                  </div>
                  <Skeleton className="w-[80%] mx-auto h-2 rounded-sm" />
                  <Skeleton className="w-[80%] mx-auto h-2 rounded-sm" />
                </div>
              </div>
              <div className="w-full  p-2 flex flex-col items-center gap-2 bg-[#1010308e] rounded-md">
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2 w-full">
                    <Skeleton className="h-8 w-8  rounded-full" />
                    <div className="flex flex-col  gap-1">
                      <Skeleton className="h-2 w-[150px] rounded-sm" />
                      <Skeleton className="h-2 w-[120px] rounded-sm" />
                    </div>
                  </div>
                  <Skeleton className="w-[80%] mx-auto h-2 rounded-sm" />
                  <Skeleton className="w-[80%] mx-auto h-2 rounded-sm" />
                </div>
              </div>
            </>
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
          <div className="flex flex-col items-center justify-center w-[90%] mb-4 ">
            <img alt={""} src={empty} className="w-[40px]" />
            <span className="text-gray-500 tracking-wider font-extrabold mt-4 text-sm">
              Empty
            </span>
            <span className="text-gray-500 tracking-wider font-bold text-sm ">
              You have No Notifications
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationMenu;
