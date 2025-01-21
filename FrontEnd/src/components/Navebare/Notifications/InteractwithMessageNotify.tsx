import { Link, useLocation } from "react-router-dom";
import { resetModel, updateThisEntity } from "../../../context/StateManeger";
import { formateDate } from "../../../utils/common";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { IInteractWithMessageNotify } from "../../../types/notificationTypes";
import { FcLike } from "react-icons/fc";
import { AiTwotoneDislike, AiTwotoneLike } from "react-icons/ai";

type IProps = Omit<IInteractWithMessageNotify, "_id" | "type" | "isRead">;

const MessageReactionNotify = ({ interactedUser, typeOfInteraction, messageLocation, createdAt }: IProps) => {
  const isChatOpen = useAppSelector((state) => state.stateManeger.isChatOpen);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const date = formateDate(createdAt);

  return (
    <div className="flex flex-col gap-y-1 rounded-md border border-gray-700 bg-[#1010308e] p-1 sm:gap-y-2 sm:p-2">
      <div className="flex items-center gap-x-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-[4px] bg-[#7aec2e25]">
          {typeOfInteraction === "loves" && <FcLike />}
          {typeOfInteraction === "likes" && <AiTwotoneLike />}
          {typeOfInteraction === "dislikes" && <AiTwotoneDislike />}
        </span>
        <h1 className="text-[#d67d54]">MESSAGE REACTION</h1>
        <span className="ml-auto text-sm text-[#928888]">{date}</span>
      </div>
      <p className="w-full text-xs text-[#bbc6d1] sm:text-sm">
        <Link
          onClick={() => dispatch(resetModel())}
          to={`/user/${interactedUser._id}`}
          className="mr-1 text-xs text-[#696cf3] underline sm:text-sm"
        >
          {interactedUser.name}
        </Link>
        {typeOfInteraction === "loves" && "make Love to your message"}
        {typeOfInteraction === "likes" && "make Like to your message"}
        {typeOfInteraction === "dislikes" && "make Dislike to your message"}
      </p>

      <Link
        to={
          smallScreen
            ? `/chat?messageId=${messageLocation}`
            : `${location.pathname}?messageId=${messageLocation}`
        }
        onClick={() => {
          dispatch(resetModel());
          if (!isChatOpen && !smallScreen) {
            dispatch(updateThisEntity({ entity: "isChatOpen", value: true }));
          }
        }}
        className="ml-auto w-[90px] rounded-[4px] border border-gray-700 bg-[#364072ee] py-0.5 text-center text-sm text-[#eee] underline sm:py-1"
      >
        see that
      </Link>
    </div>
  );
};

export default MessageReactionNotify;
