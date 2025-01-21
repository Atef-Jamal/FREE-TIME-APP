import { useCallback, useEffect } from "react";
import { MdOutlineClose, MdOutlineEditNotifications } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { resetModel, showPopup } from "../../../context/StateManeger";
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
import MessageReactionNotify from "./InteractwithMessageNotify";
import { empty } from "../../../assets";
import { useQueryClient } from "@tanstack/react-query";
import { ICashedNotificaions, INotifications } from "../../../types/notificationTypes";

interface IProps {
  notifications: INotifications[] | undefined;
  isLoading: boolean;
  error: string | undefined;
}

const NotificationMenu = ({ notifications, isLoading, error }: IProps) => {
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const markNotificationasRead = useCallback(async () => {
    try {
      const response = await makeRequest.patch("api/notifications", { ddd: "ddd" });
      if (response.status === 200) {
        queryClient.setQueryData(
          ["notifications"],
          (previous: ICashedNotificaions): ICashedNotificaions | undefined => {
            if (!previous) return;
            return previous.map((notify) => {
              if (notify.isRead === false) {
                return { ...notify, isRead: true };
              }
              return notify;
            });
          },
        );
      }
    } catch (error) {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    }
  }, [dispatch, queryClient]);

  useEffect(() => {
    const isThereNotificationUnReaded = notifications?.some((item) => item.isRead === false);
    if (isThereNotificationUnReaded) {
      markNotificationasRead();
    }
  }, [currentUserStatus, markNotificationasRead, notifications]);

  return (
    <div className="mb-auto mt-11 flex max-h-[90%] w-[90%] flex-col rounded-lg bg-[#2e2e4b] p-1 sm:ml-auto sm:mr-5 sm:mt-14 sm:max-w-[600px] sm:p-2 md:p-3">
      <div className="flex items-center justify-between bg-[#2e2e4b]">
        <h1 className="flex items-center gap-x-2 text-lg font-bold tracking-wider text-gray-300">
          <MdOutlineEditNotifications className="text-2xl" /> Notifications
        </h1>
        <MdOutlineClose onClick={() => dispatch(resetModel())} className="text-2xl" />
      </div>
      <hr className="mx-1 mb-1 mt-2 border-[#746969]" />
      <div className="scrollbar-custom flex-1 space-y-1 overflow-y-auto">
        {isLoading && (
          <div className="flex h-12 w-full items-center justify-center">
            <Spinner className="h-6 w-6 border-[4px]" />
          </div>
        )}
        {error && <p className="my-5 h-12 text-center text-sm text-red-500">{error}</p>}
        {notifications?.map((item) => {
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
          if (item.type === "INTERACT-WITH-MESSAGE") {
            return (
              <MessageReactionNotify
                key={item._id}
                messageLocation={item.messageLocation}
                createdAt={item.createdAt}
                interactedUser={item.interactedUser}
                typeOfInteraction={item.typeOfInteraction}
              />
            );
          }
        })}
      </div>
      {notifications?.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-y-3 py-4">
          <img src={empty} alt="empty" className="h-10 w-10 object-contain opacity-90" />
          <p className="text-sm font-bold text-gray-500">Empty Notifications</p>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
