import { Link, useLocation } from "react-router-dom";
import { GoMention } from "react-icons/go";
import { resetModel, updateThisEntity } from "../../../context/StateManeger";
import { formateDate } from "../../../utils/common";
import { useAppDispatch, useAppSelector } from "../../../context/Hooks";
import { IMentionNotify } from "../../../types/notificationTypes";

type IProps = Omit<IMentionNotify, "_id" | "type" | "isRead">;

const MentionNotify = ({ mentionedUser, messageLocation, createdAt }: IProps) => {
  const isChatOpen = useAppSelector((state) => state.stateManeger.isChatOpen);
  const smallScreen = useAppSelector((state) => state.stateManeger.smallScreen);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const date = formateDate(createdAt);

  return (
    <div className="flex flex-col gap-y-1 rounded-md border border-gray-700 bg-[#1010308e] p-1 sm:gap-y-2 sm:p-2">
      <div className="flex items-center gap-x-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-[4px] bg-[#7aec2e25]">
          <GoMention />
        </span>
        <h1 className="text-[#d67d54]">MENTION</h1>
        <span className="ml-auto text-sm text-[#928888]">{date}</span>
      </div>
      <p className="w-full text-xs text-[#bbc6d1] sm:text-sm">
        <Link
          onClick={() => dispatch(resetModel())}
          to={`/user/${mentionedUser._id}`}
          className="mr-1 text-xs text-[#696cf3] underline sm:text-sm"
        >
          {mentionedUser.name}
        </Link>
        mentioned you in public chat
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

export default MentionNotify;
