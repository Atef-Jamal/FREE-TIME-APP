import { Link, useLocation } from "react-router-dom";
import { updateThisEntity } from "../../../context/StateManeger";
import { formateDate } from "../../../utils/common";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { TypeInteractWithMessageNotify } from "../../../types/notificationTypes";
import { FcLike } from "react-icons/fc";
import { AiTwotoneDislike, AiTwotoneLike } from "react-icons/ai";

type PropType = Omit<TypeInteractWithMessageNotify, "_id" | "type" | "isRead">;

const MessageReactionNotify = ({
  interactedUser,
  typeOfInteraction,
  messageLocation,
  createdAt,
}: PropType) => {
  const isChatOpen = useAppSelector((state) => state.stateManeger.isChatOpen);
  const isMobile = useAppSelector((state) => state.stateManeger.isMobile);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const date = formateDate(createdAt);

  return (
    <div className="w-full flex flex-col items-center gap-2 xs:gap-1 bg-[#1010308e] rounded-md p-2 xs:p-1 border border-gray-700 ">
      <div className="flex gap-2 w-full">
        <span className="w-8 h-6 rounded-lg bg-[#7aec2e25] flex items-center justify-center">
          {typeOfInteraction === "loves" && <FcLike />}
          {typeOfInteraction === "likes" && <AiTwotoneLike />}
          {typeOfInteraction === "dislikes" && <AiTwotoneDislike />}
        </span>
        <h1 className="text-[#d67d54]">MESSAGE REACTION</h1>
        <span className="text-xs ml-auto text-[#9b9090] pr-1">{date}</span>
      </div>
      <p className="text-sm w-full text-[#bbc6d1] sm:text-xs">
        <Link to={`/user/${interactedUser._id}`} className="text-sm text-[#696cf3] mr-1 underline sm:text-xs">
          {interactedUser.name}
        </Link>
        {typeOfInteraction === "loves" && "make Love to your message"}
        {typeOfInteraction === "likes" && "make Like to your message"}
        {typeOfInteraction === "dislikes" && "make Dislike to your message"}
      </p>

      <Link
        to={
          isMobile
            ? `/chat?messageId=${messageLocation}`
            : `${location.pathname}?messageId=${messageLocation}`
        }
        onClick={() => {
          dispatch(updateThisEntity({ entity: "openNotification", value: false }));
          if (!isChatOpen && !isMobile) {
            dispatch(updateThisEntity({ entity: "isChatOpen", value: true }));
          }
        }}
        className="text-sm bg-[#364072ee] w-[100px] py-1 xs:py-[3px] rounded-md border border-gray-700 ml-auto text-center underline text-[#eee]"
      >
        see that
      </Link>
    </div>
  );
};

export default MessageReactionNotify;
