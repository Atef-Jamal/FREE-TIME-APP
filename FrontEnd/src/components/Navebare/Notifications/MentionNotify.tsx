import { Link, useLocation } from "react-router-dom";
import { GoMention } from "react-icons/go";
import { updateThisEntity } from "../../../context/StateManeger";
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
    <div className="xs:gap-1 xs:p-1 flex w-full flex-col items-center gap-2 rounded-md border border-gray-700 bg-[#1010308e] p-2">
      <div className="flex w-full gap-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-lg bg-[#7aec2e25]">
          <GoMention />
        </span>
        <h1 className="text-[#d67d54]">MENTION</h1>
        <span className="ml-auto pr-1 text-xs text-[#9b9090]">{date}</span>
      </div>
      <p className="w-full text-sm text-[#bbc6d1] sm:text-xs">
        <Link to={`/user/${mentionedUser._id}`} className="mr-1 text-sm text-[#696cf3] underline sm:text-xs">
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

export default MentionNotify;
