import { RefObject } from "react";
import { BiCircle } from "react-icons/bi";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import type { IPrivateMessage } from "../../types";
import { useAppSelector } from "../../context/hooks";
import { cn } from "../../utilities";
import { selectCurrentUser } from "../../context/appStateSlice";
import RelativeCountdown from "../../components/Ui/TimeCountDown";

interface IProps {
  messagesLength: number;
  message: IPrivateMessage;
  lastMessageRef: RefObject<HTMLDivElement | null>;
  index: number;
}

const PrivateMessageItem = ({ messagesLength, message, lastMessageRef, index }: IProps) => {
  const currentUser = useAppSelector(selectCurrentUser);

  const isread = message.sender._id === currentUser?._id && message.isRead;
  const isSending = message.sender._id === currentUser?._id && message.isSended === "PENDING";
  const isunread =
    message.sender._id === currentUser?._id &&
    !message.isRead &&
    (message.isSended === "SUCCESS" || message.isSended === undefined);

  return (
    <div
      style={{
        direction: message.sender._id === currentUser?._id ? "rtl" : "ltr",
      }}
      ref={messagesLength - 1 === index ? lastMessageRef : null}
      className="relative flex w-full items-start justify-start gap-2 p-2"
    >
      <div className="h-7 w-7 rounded-full sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
        <img alt="" src={message.sender.profilePicture} className="h-full w-full rounded-full" />
      </div>
      <div
        className={cn(
          "relative flex max-w-[90%] flex-col rounded-md p-1 md:max-w-[70%]",
          message.sender._id === currentUser?._id ? "bg-[#101a30]" : "bg-[#12151f]",
        )}
      >
        <div
          style={{
            direction: message.sender._id === currentUser?._id ? "rtl" : "ltr",
          }}
          className="flex w-full items-center gap-2 border-b border-gray-600 pb-[2px]"
        >
          <span className="truncate text-xs font-bold text-[#3c72c4] sm:text-sm">{message.sender.name}</span>
          <div className="flex items-center gap-2">
            <RelativeCountdown targetIsoString={message.createdAt} />
            {isread && <IoCheckmarkDoneSharp className="font-bold" />}
            {isSending && <BiCircle />}
            {isunread && <IoCheckmarkSharp className="font-bold" />}
            {/* {message.sender._id === currentUser?._id && message.isSended === "PENDING" && <BiCircle />}
            {message.sender._id === currentUser?._id && message.isSended === "SUCCESS" && (
              <span>
                <IoCheckmarkSharp className="font-bold opacity-50" />
              </span>
            )} */}
            {/* {conversationRead && message.sender._id === currentUser?._id && (
              <span>
                <IoCheckmarkDoneSharp className="font-bold opacity-50" />
              </span>
            )}
            {!conversationRead && message.sender._id === currentUser?._id && (
              <span>
                <IoCheckmarkSharp className="font-bold opacity-50" />
              </span>
            )} */}
            {/* {message.isSended !== undefined && message.isSended === "PENDING" && <BiCircle />}
            {message.isSended !== undefined && message.isSended === "SUCCESS" && <FcOk />}
            {message.isSended !== undefined && message.isSended === "FAILED" && <IoCloseCircleOutline />} */}
          </div>
        </div>
        <div className="max-w-full break-words pt-[2px] text-xs text-[#5fc1df] sm:text-sm">
          {message.message}
        </div>
      </div>
    </div>
  );
};

export default PrivateMessageItem;
