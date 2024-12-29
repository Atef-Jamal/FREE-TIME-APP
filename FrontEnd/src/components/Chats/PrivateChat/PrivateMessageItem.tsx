import { FcOk } from "react-icons/fc";
import { useAppSelector } from "../../../context/Hooks";
import { formateDate } from "../../../utils/common";
import {
  IoCheckmarkDoneSharp,
  IoCheckmarkSharp,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { RefObject } from "react";
import { TypePrivateMessage } from "../../../types/privateChatTypes";
import { BiCircle } from "react-icons/bi";

interface TypeProps {
  messagesLength: number;
  message: TypePrivateMessage;
  lastMessageRef: RefObject<HTMLDivElement | null>;
  index: number;
}

const PrivateMessageItem = ({
  messagesLength,
  message,
  lastMessageRef,
  index,
}: TypeProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const date = formateDate(message.createdAt);
  return (
    <div
      style={{
        direction: message.sender._id === currentUser?._id ? "rtl" : "ltr",
      }}
      ref={messagesLength - 1 === index ? lastMessageRef : null}
      className="w-full relative p-2 lg:p-1 flex items-start justify-start gap-2 sm:gap-1 "
    >
      <div className="w-10 h-10 sm:w-7 sm:h-7 rounded-full">
        <img
          alt=""
          src={message.sender.profilePicture}
          className="w-full h-full rounded-full "
        />
      </div>
      <div
        className={`relative max-w-[70%] xs:max-w-[85%] flex flex-col ${
          message.sender._id === currentUser?._id
            ? "bg-[#101a30] "
            : "bg-[#12151f] "
        } rounded-md p-1`}
      >
        <div
          style={{
            direction: message.sender._id === currentUser?._id ? "rtl" : "ltr",
          }}
          className="w-full flex items-center gap-2 border-b pb-[2px] border-gray-600"
        >
          <span className="text-[#3785fa] text-sm xs:text-xs font-bold truncate">
            {message.sender.name}
          </span>
          <div className="flex items-center gap-2">
            <span
              dir="ltr"
              className="text-[#746767] text-sm sm:text-xs font-bold w-[110px] flex items-center justify-center"
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
                <IoCheckmarkSharp className="font-bold opacity-50 " />
              </span>
            )}
            {message.isSended !== undefined &&
              message.isSended === "PENDING" && <BiCircle />}
            {message.isSended !== undefined &&
              message.isSended === "SUCCESS" && <FcOk />}
            {message.isSended !== undefined &&
              message.isSended === "FAILED" && <IoCloseCircleOutline />}
          </div>
        </div>
        <div className="max-w-[300px] break-words text-[#5fc1df] text-sm sm:text-xs pt-[2px]">
          {message.message}
        </div>
      </div>
    </div>
  );
};

export default PrivateMessageItem;
