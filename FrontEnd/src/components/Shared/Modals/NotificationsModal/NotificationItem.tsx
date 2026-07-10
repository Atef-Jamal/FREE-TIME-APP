import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AiTwotoneDislike, AiTwotoneLike } from "react-icons/ai";
import { GoMention } from "react-icons/go";
import { GrAnnounce } from "react-icons/gr";
import { FcApproval, FcConferenceCall, FcLike, FcMusic, FcPaid } from "react-icons/fc";
import type { INotifications } from "../../../../types";
import {
  resetModel,
  setCurrentUser,
  openToast,
  updateStateField,
  selectCurrentUser,
  selectSmallScreen,
  selectIsChatOpen,
} from "../../../../context/appStateSlice";
import { verifiedImage } from "../../../../assets";
import { useAppDispatch, useAppSelector } from "../../../../context/hooks";
import { cn, formateDate, handleApiError } from "../../../../utilities";
import Spinner from "../../Common/Spinner";
import { collectReward } from "../../../../services";
import { updateNotificationsCache } from "../../../../tanstackQuery/queryCache";

const NotificationItem = (notify: INotifications) => {
  // @ts-expect-error-isCollected does not exist on some notifications
  const [isRewardCollected, setIsRewadCollected] = useState(notify.metadata.isCollected);
  const mobileScreen = useAppSelector(selectSmallScreen);
  const currentUser = useAppSelector(selectCurrentUser);
  const isChatOpen = useAppSelector(selectIsChatOpen);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  let icon = null;
  let title = "";
  let contentBody = null;
  let button = null;
  const date = formateDate(notify.createdAt);

  const collect = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const response = await collectReward(notify._id);
      updateNotificationsCache({ queryClient, notification: response });
      setIsRewadCollected(response.metadata.isCollected);
      dispatch(
        setCurrentUser({
          ...currentUser,
          points: currentUser.points + response.metadata.prize,
        }),
      );
      dispatch(
        openToast({
          message: "collected successfully ",
          type: "SUCESS",
        }),
      );
    } catch (error) {
      dispatch(
        openToast({
          message: handleApiError(error),
          type: "ERROR_GENERAL",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  switch (notify.type) {
    case "REFERRER":
      icon = <FcConferenceCall className="text-xl" />;
      title = "REFERRER";
      contentBody = (
        <>
          successfully Reffered Your Friend
          <Link
            onClick={() => dispatch(resetModel())}
            to={`/user/${notify.metadata.referredUser._id}`}
            className="mx-1 text-[#696cf3] underline"
          >
            {notify.metadata.referredUser.name}
          </Link>
          and Get {notify.metadata.prize} points as a Reward
        </>
      );
      button = (
        <button
          onClick={collect}
          disabled={isRewardCollected || isLoading}
          className={cn(
            "flex h-[30px] w-[100px] items-center justify-center rounded-[4px] border border-gray-700 text-sm sm:h-[35px]",
            isRewardCollected ? "bg-[#1a1e33ee]" : "bg-[#01D676]",
          )}
        >
          {isRewardCollected ? " collected" : isLoading ? <Spinner color="blue" /> : "collect"}
        </button>
      );
      break;
    case "QUIZ-APP":
      icon = <FcApproval className="text-xl" />;
      title = "QUIZ APP";
      contentBody = (
        <>
          quiz app successfully completed! and get
          <span className="mx-1 font-bold text-[#696cf3]">{notify.metadata.prize}</span>
          points as a Reward
        </>
      );
      button = (
        <button
          onClick={collect}
          disabled={isRewardCollected || isLoading}
          className={cn(
            "flex h-[30px] w-[100px] items-center justify-center rounded-[4px] border border-gray-700 text-sm sm:h-[35px]",
            isRewardCollected ? "bg-[#1a1e33ee]" : "bg-[#01D676]",
          )}
        >
          {isRewardCollected ? " collected" : isLoading ? <Spinner color="blue" /> : "collect"}
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
            to={`/user/${notify.metadata.mentionedUser._id}`}
            className="mr-1 text-[#696cf3] underline"
          >
            {notify.metadata.mentionedUser.name}
          </Link>
          mentioned you in public chat
        </>
      );
      button = (
        <Link
          to={
            mobileScreen
              ? `/chat?messageId=${notify.metadata.messageLocation}`
              : `${location.pathname}?messageId=${notify.metadata.messageLocation}`
          }
          onClick={() => {
            dispatch(resetModel());
            if (!isChatOpen && !mobileScreen) {
              dispatch(updateStateField({ entity: "isChatOpen", value: true }));
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
          {notify.metadata.typeOfInteraction === "loves" && <FcLike />}
          {notify.metadata.typeOfInteraction === "likes" && <AiTwotoneLike />}
          {notify.metadata.typeOfInteraction === "dislikes" && <AiTwotoneDislike />}
        </>
      );
      title = "MESSAGE REACTION";
      contentBody = (
        <>
          <Link
            onClick={() => dispatch(resetModel())}
            to={`/user/${notify.metadata.interactedUser._id}`}
            className="mr-1 text-[#696cf3] underline"
          >
            {notify.metadata.interactedUser.name}
          </Link>
          {notify.metadata.typeOfInteraction === "loves" && "make Love to your message"}
          {notify.metadata.typeOfInteraction === "likes" && "make Like to your message"}
          {notify.metadata.typeOfInteraction === "dislikes" && "make Dislike to your message"}
        </>
      );
      button = (
        <Link
          to={
            mobileScreen
              ? `/chat?messageId=${notify.metadata.messageLocation}`
              : `${location.pathname}?messageId=${notify.metadata.messageLocation}`
          }
          onClick={() => {
            dispatch(resetModel());
            if (!isChatOpen && !mobileScreen) {
              dispatch(updateStateField({ entity: "isChatOpen", value: true }));
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
          <span className="mx-1 font-bold text-[#696cf3]">{notify.metadata.prize}</span>
          points as a Reward
        </>
      );
      button = (
        <button
          onClick={collect}
          disabled={isRewardCollected || isLoading}
          className={cn(
            "flex h-[30px] w-[100px] items-center justify-center rounded-[4px] border border-gray-700 text-sm sm:h-[35px]",
            isRewardCollected ? "bg-[#1a1e33ee]" : "bg-[#01D676]",
          )}
        >
          {isRewardCollected ? " collected" : isLoading ? <Spinner color="blue" /> : "collect"}
        </button>
      );
      break;
    case "EMAIL-VERIFIED":
      icon = <img src={verifiedImage} alt="" className="h-6 w-6 object-cover" />;
      title = "EMAIL VERIFIED";
      contentBody = (
        <>
          successfully verified your email and get
          <span className="mx-1 font-bold text-[#696cf3]">{notify.metadata.prize}</span>
          as Reward
        </>
      );
      button = (
        <button
          onClick={collect}
          disabled={isRewardCollected || isLoading}
          className={cn(
            "flex h-[30px] w-[100px] items-center justify-center rounded-[4px] border border-gray-700 text-sm sm:h-[35px]",
            isRewardCollected ? "bg-[#1a1e33ee]" : "bg-[#01D676]",
          )}
        >
          {isRewardCollected ? " collected" : isLoading ? <Spinner color="blue" /> : "collect"}
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
            to={`/musics?to=${notify.metadata.musicId}`}
            onClick={() => dispatch(resetModel())}
            className="mx-1 text-[#696cf3] underline"
          >
            {notify.metadata.musicTitle}
          </Link>
          For
          <span className="mx-1 text-[#696cf3]">{notify.metadata.price}</span>
          points
        </>
      );
      button = (
        <Link
          to={`/myprofile?to=${notify.metadata.musicId}`}
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
            to={`/marketplace?to=${notify.metadata.frame._id}`}
            onClick={() => dispatch(resetModel())}
            className="mx-1 text-[#696cf3] underline"
          >
            {notify.metadata.frame.title}
          </Link>
          For
          <span className="mx-1 font-bold text-[#696cf3]">{notify.metadata.price}</span>
          points
        </>
      );
      button = (
        <Link
          to={`/myprofile?to=${notify.metadata.frame._id}`}
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
      contentBody = <>{notify.metadata.announceContent}</>;
      button = null;
      break;

    default:
      break;
  }

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
