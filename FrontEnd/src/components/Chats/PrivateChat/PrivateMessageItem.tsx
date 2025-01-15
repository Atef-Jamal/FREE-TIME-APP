import { FcOk } from "react-icons/fc";
import { useAppSelector } from "../../../context/Hooks";
import { formateDate } from "../../../utils/common";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp, IoCloseCircleOutline } from "react-icons/io5";
import { RefObject } from "react";
import { TypePrivateMessage } from "../../../types/privateChatTypes";
import { BiCircle } from "react-icons/bi";

interface TypeProps {
  messagesLength: number;
  message: TypePrivateMessage;
  lastMessageRef: RefObject<HTMLDivElement | null>;
  index: number;
}

const PrivateMessageItem = ({ messagesLength, message, lastMessageRef, index }: TypeProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const date = formateDate(message.createdAt);
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
        className={`relative flex max-w-[90%] flex-col md:max-w-[70%] ${
          message.sender._id === currentUser?._id ? "bg-[#101a30]" : "bg-[#12151f]"
        } rounded-md p-1`}
      >
        <div
          style={{
            direction: message.sender._id === currentUser?._id ? "rtl" : "ltr",
          }}
          className="flex w-full items-center gap-2 border-b border-gray-600 pb-[2px]"
        >
          <span className="truncate text-xs font-bold text-[#3c72c4] sm:text-sm">{message.sender.name}</span>
          <div className="flex items-center gap-2">
            <span
              dir="ltr"
              className="flex w-[110px] items-center justify-center text-xs font-bold text-[#746767]"
            >
              {date}
            </span>
            {message.isRead && message.sender._id === currentUser?._id && (
              <span>
                <IoCheckmarkDoneSharp className="font-bold opacity-50" />
              </span>
            )}
            {!message.isRead && message.sender._id === currentUser?._id && (
              <span>
                <IoCheckmarkSharp className="font-bold opacity-50" />
              </span>
            )}
            {message.isSended !== undefined && message.isSended === "PENDING" && <BiCircle />}
            {message.isSended !== undefined && message.isSended === "SUCCESS" && <FcOk />}
            {message.isSended !== undefined && message.isSended === "FAILED" && <IoCloseCircleOutline />}
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
