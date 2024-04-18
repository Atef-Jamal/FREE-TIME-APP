import { Link, useLocation } from "react-router-dom";
import { GoMention } from "react-icons/go";
import {
  chatToggleButton,
  toggleNotifications,
} from "../../../context/StateManeger";
import { TypeMentionNotify } from "../../../types";
import { timeAgoFromMongoDBDate } from "../../../context/functions";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";

type PropType = Omit<TypeMentionNotify, "_id" | "type" | "isRead">;

const MentionNotify = ({
  mentionedUser,
  messageLocation,
  createdAt,
}: PropType) => {
  const { isChatOpen } = useAppSelector((state) => state.stateManeger);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const date = timeAgoFromMongoDBDate(createdAt.toString());

  return (
    <div className="w-full flex flex-col items-center gap-2 xs:gap-1 bg-[#1010308e] rounded-md p-2 xs:p-1 border border-gray-700 ">
      <div className="flex gap-2 w-full">
        <span className="w-8 h-6 rounded-lg bg-[#7aec2e25] flex items-center justify-center">
          <GoMention />
        </span>
        <h1 className="text-[#d67d54]">MENTION</h1>
        <span className="text-sm ml-auto text-[#7c7a7a] pr-1">{date}</span>
      </div>
      <p className="text-sm w-full text-[#bbc6d1]">
        <Link
          to={`/user/${mentionedUser._id}`}
          className="text-sm text-[#696cf3] mr-1 underline"
        >
          {mentionedUser.name}
        </Link>
        mentioned you in public chat
      </p>

      <Link
        to={
          window.innerWidth > 867
            ? `${
                location.pathname === "/chat" ? "/" : location.pathname
              }?messageid=${messageLocation}`
            : `/chat?messageid=${messageLocation}`
        }
        onClick={() => {
          dispatch(toggleNotifications(false));
          if (!isChatOpen) {
            dispatch(chatToggleButton());
          }
        }}
        className="text-sm bg-[#364072ee] w-[100px] py-1 xs:py-[3px] rounded-md border border-gray-700 ml-auto text-center underline text-[#eee]"
      >
        see that
      </Link>
    </div>
  );
};

export default MentionNotify;
