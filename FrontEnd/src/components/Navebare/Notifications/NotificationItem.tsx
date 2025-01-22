import { Link } from "react-router-dom";
import {
  ICashedNotificaions,
  INotificationModelName,
  INotifications,
} from "../../../types/notificationTypes";
import { FcApproval, FcConferenceCall, FcLike, FcMusic, FcPaid } from "react-icons/fc";
import { resetModel, setCurrentUser, showPopup, updateThisEntity } from "../../../context/StateManeger";
import { AiTwotoneDislike, AiTwotoneLike } from "react-icons/ai";
import { GoMention } from "react-icons/go";
import { verifiedImage } from "../../../assets";
import { GrAnnounce } from "react-icons/gr";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { useState } from "react";
import Spinner from "../../Others/Spinner";
import { cn, collectReward, formateDate, handleApiError } from "../../../utils/common";
import { useQueryClient } from "@tanstack/react-query";

const NotificationItem = (notify: INotifications) => {
  // @ts-expect-error-isCollected does not exist on some notifications
  const [isRewardCollected, setIsRewadCollected] = useState(notify.isCollected);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const isChatOpen = useAppSelector((state) => state.stateManeger.isChatOpen);
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  let icon = null;
  let title = "";
  let contentBody = null;
  let button = null;
  const date = formateDate(notify.createdAt);

  switch (notify.type) {
    case "REFERRER":
      icon = <FcConferenceCall className="text-xl" />;
      title = "REFERRER";
      contentBody = (
        <>
          successfully Reffered Your Friend
          <Link
            onClick={() => dispatch(resetModel())}
            to={`/user/${notify.referredUser._id}`}
            className="mx-1 text-[#696cf3] underline"
          >
            {notify.referredUser.name}
          </Link>
          and Get {notify.prize} points as a Reward
        </>
      );
      button = (
        <button
          onClick={() => collect("Referrer")}
          disabled={isRewardCollected || isLoading}
          className={cn(
            "w-[100px] rounded-[4px] border border-gray-700 py-0.5 text-sm sm:py-1",
            isRewardCollected ? "bg-[#1a1e33ee]" : "bg-[#01D676]",
          )}
        >
          {isRewardCollected ? (
            " collected"
          ) : isLoading ? (
            <Spinner className="mx-auto h-5 w-5 border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            "collect"
          )}
        </button>
      );
      break;
    case "QUIZ-APP":
      icon = <FcApproval className="text-xl" />;
      title = "QUIZ APP";
      contentBody = (
        <>
          quiz app successfully completed! and get
          <span className="mx-1 font-bold text-[#696cf3]">{notify.prize}</span>
          points as a Reward
        </>
      );
      button = (
        <button
          onClick={() => collect("QuizeApp")}
          disabled={isRewardCollected || isLoading}
          className={cn(
            "w-[100px] rounded-[4px] border border-gray-700 py-0.5 text-sm sm:py-1",
            isRewardCollected ? "bg-[#1a1e33ee]" : "bg-[#01D676]",
          )}
        >
          {isRewardCollected ? (
            " collected"
          ) : isLoading ? (
            <Spinner className="mx-auto h-5 w-5 border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            "collect"
          )}
        </button>
      );
      break;
    case "MENTION":
      icon = <GoMention />;
      title = "MENTION";
      contentBody = (
        <>
          <Link
            onClick={() => dispatch(resetModel())}
            to={`/user/${notify.mentionedUser._id}`}
            className="mr-1 text-[#696cf3] underline"
          >
            {notify.mentionedUser.name}
          </Link>
          mentioned you in public chat
        </>
      );
      button = (
        <Link
          to={
            smallScreen
              ? `/chat?messageId=${notify.messageLocation}`
              : `${location.pathname}?messageId=${notify.messageLocation}`
          }
          onClick={() => {
            dispatch(resetModel());
            if (!isChatOpen && !smallScreen) {
              dispatch(updateThisEntity({ entity: "isChatOpen", value: true }));
            }
          }}
          className="w-[90px] rounded-[4px] border border-gray-700 bg-[#364072ee] py-0.5 text-center text-sm text-[#eee] underline sm:py-1"
        >
          see that
        </Link>
      );
      break;
    case "INTERACT-WITH-MESSAGE":
      icon = (
        <>
          {notify.typeOfInteraction === "loves" && <FcLike />}
          {notify.typeOfInteraction === "likes" && <AiTwotoneLike />}
          {notify.typeOfInteraction === "dislikes" && <AiTwotoneDislike />}
        </>
      );
      title = "MESSAGE REACTION";
      contentBody = (
        <>
          <Link
            onClick={() => dispatch(resetModel())}
            to={`/user/${notify.interactedUser._id}`}
            className="mr-1 text-[#696cf3] underline"
          >
            {notify.interactedUser.name}
          </Link>
          {notify.typeOfInteraction === "loves" && "make Love to your message"}
          {notify.typeOfInteraction === "likes" && "make Like to your message"}
          {notify.typeOfInteraction === "dislikes" && "make Dislike to your message"}
        </>
      );
      button = (
        <Link
          to={
            smallScreen
              ? `/chat?messageId=${notify.messageLocation}`
              : `${location.pathname}?messageId=${notify.messageLocation}`
          }
          onClick={() => {
            dispatch(resetModel());
            if (!isChatOpen && !smallScreen) {
              dispatch(updateThisEntity({ entity: "isChatOpen", value: true }));
            }
          }}
          className="w-[90px] rounded-[4px] border border-gray-700 bg-[#364072ee] py-0.5 text-center text-sm text-[#eee] underline sm:py-1"
        >
          see that
        </Link>
      );
      break;
    case "GUESS-CARD":
      icon = <FcApproval className="text-xl" />;
      title = "GAME";
      contentBody = (
        <>
          Guess cards game successfully completed! and get
          <span className="mx-1 font-bold text-[#696cf3]">{notify.prize}</span>
          points as a Reward
        </>
      );
      button = (
        <button
          onClick={() => collect("GuessCard")}
          disabled={isRewardCollected || isLoading}
          className={cn(
            "w-[100px] rounded-[4px] border border-gray-700 py-0.5 text-sm sm:py-1",
            isRewardCollected ? "bg-[#1a1e33ee]" : "bg-[#01D676]",
          )}
        >
          {isRewardCollected ? (
            " collected"
          ) : isLoading ? (
            <Spinner className="mx-auto h-5 w-5 border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            "collect"
          )}
        </button>
      );
      break;
    case "EMAIL-VERIFIED":
      icon = <img src={verifiedImage} alt="" className="h-6 w-6 object-cover" />;
      title = "EMAIL VERIFIED";
      contentBody = (
        <>
          successfully verified your email and get
          <span className="mx-1 font-bold text-[#696cf3]">{notify.prize}</span>
          as Reward
        </>
      );
      button = (
        <button
          onClick={() => collect("EmailVerfication")}
          disabled={isRewardCollected || isLoading}
          className={cn(
            "w-[100px] rounded-[4px] border border-gray-700 py-0.5 text-sm sm:py-1",
            isRewardCollected ? "bg-[#1a1e33ee]" : "bg-[#01D676]",
          )}
        >
          {isRewardCollected ? (
            " collected"
          ) : isLoading ? (
            <Spinner className="mx-auto h-5 w-5 border-b-[#291a3b] border-l-[#291a3b]" />
          ) : (
            "collect"
          )}
        </button>
      );
      break;
    case "MUSIC":
      icon = <FcMusic className="text-xl" />;
      title = "MUSIC PURSHASED";
      contentBody = (
        <>
          congratulation! For Buying
          <Link
            to={`/musics?to=${notify.musicId}`}
            onClick={() => dispatch(resetModel())}
            className="mx-1 text-[#696cf3] underline"
          >
            {notify.musicTitle}
          </Link>
          For
          <span className="mx-1 text-[#696cf3]">{notify.price}</span>
          points
        </>
      );
      button = (
        <Link
          to={`/myprofile?to=${notify.musicId}`}
          onClick={() => dispatch(resetModel())}
          className="w-[90px] rounded-[4px] border border-gray-700 bg-[#414a77ee] py-0.5 text-center text-sm text-[#eee] underline sm:py-1"
        >
          see that
        </Link>
      );
      break;
    case "BUY-FRAME":
      icon = <FcPaid className="text-xl" />;
      title = "FRAME PURSHASED";
      contentBody = (
        <>
          congratulation! for buying
          <Link
            to={`/marketplace?to=${notify.frame._id}`}
            onClick={() => dispatch(resetModel())}
            className="mx-1 text-[#696cf3] underline"
          >
            {notify.frame.title}
          </Link>
          For
          <span className="mx-1 font-bold text-[#696cf3]">{notify.price}</span>
          points
        </>
      );
      button = (
        <Link
          to={`/myprofile?to=${notify.frame._id}`}
          onClick={() => dispatch(resetModel())}
          className="w-[90px] rounded-[4px] border border-gray-700 bg-[#414a77ee] py-0.5 text-center text-sm text-[#eee] underline sm:py-1"
        >
          see that
        </Link>
      );
      break;
    case "ANNOUNCEMENT":
      icon = <GrAnnounce className="text-xl" />;
      title = "ANNOUNCEMENT";
      contentBody = <>{notify.announceContent}</>;
      button = null;
      break;

    default:
      break;
  }

  const collect = async (notificationType: INotificationModelName) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const response = await collectReward(notify._id, notificationType);
      queryClient.setQueryData(
        ["notifications"],
        (previous: ICashedNotificaions): ICashedNotificaions | undefined => {
          if (!previous) return;
          return previous.map((item) => {
            if (item._id === notify._id) {
              return { ...item, isCollected: true };
            }
            return item;
          });
        },
      );
      setIsRewadCollected(response.isCollected);
      const updatedUser = {
        ...currentUser,
        points: currentUser.points + response.prize,
      };
      dispatch(setCurrentUser(updatedUser));
      socket?.emit("user-updated", updatedUser);
      dispatch(
        showPopup({
          message: "collected successfully ",
          type: "SUCESS",
        }),
      );
    } catch (error) {
      dispatch(
        showPopup({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-1 rounded-md border border-gray-700 bg-[#1010308e] p-1 sm:gap-y-2 sm:p-2">
      <div className="flex items-center gap-x-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-[4px] bg-[#7aec2e25]">{icon}</span>
        <h1 className="text-[#d67d54]">{title}</h1>
        <span className="ml-auto text-xs text-[#928888]">{date}</span>
      </div>
      <p className="w-full text-xs text-[#bbc6d1] sm:text-sm">{contentBody}</p>
      <div className="flex w-full items-center justify-end">{button}</div>
    </div>
  );
};

export default NotificationItem;
