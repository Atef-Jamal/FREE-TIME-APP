import { Link, useLocation } from "react-router-dom";
import { updateThisEntity } from "../../../context/StateManeger";
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
    <div className="xs:gap-1 xs:p-1 flex w-full flex-col items-center gap-2 rounded-md border border-gray-700 bg-[#1010308e] p-2">
      <div className="flex w-full gap-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-lg bg-[#7aec2e25]">
          {typeOfInteraction === "loves" && <FcLike />}
          {typeOfInteraction === "likes" && <AiTwotoneLike />}
          {typeOfInteraction === "dislikes" && <AiTwotoneDislike />}
        </span>
        <h1 className="text-[#d67d54]">MESSAGE REACTION</h1>
        <span className="ml-auto pr-1 text-xs text-[#9b9090]">{date}</span>
      </div>
      <p className="w-full text-sm text-[#bbc6d1] sm:text-xs">
        <Link to={`/user/${interactedUser._id}`} className="mr-1 text-sm text-[#696cf3] underline sm:text-xs">
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
          dispatch(updateThisEntity({ entity: "openNotification", value: false }));
          if (!isChatOpen && !smallScreen) {
            dispatch(updateThisEntity({ entity: "isChatOpen", value: true }));
          }
        }}
        className="xs:py-[3px] ml-auto w-[100px] rounded-md border border-gray-700 bg-[#364072ee] py-1 text-center text-sm text-[#eee] underline"
      >
        see that
      </Link>
    </div>
  );
};

export default MessageReactionNotify;
