import { FcCheckmark } from "react-icons/fc";
import { avatar } from "../../../assets";
import { useAppSelector } from "../../../context/Hooks";
import { formateDate } from "../../../utils/common";
import { IoCheckmarkOutline } from "react-icons/io5";
import { RefObject } from "react";
import { TypePrivateMessage } from "../../../types/privateChat";

const PrivateMessageItem = ({
  messages,
  message,
  lastMessageRef,
  conversationReaded,
  index,
}: {
  messages: TypePrivateMessage[];
  message: TypePrivateMessage;
  lastMessageRef: RefObject<HTMLDivElement>;
  conversationReaded: boolean;
  index: number;
}) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const date = formateDate(message.createdAt.toString());
  return (
    <div
      style={{
        direction: message.sender._id === currentUser?._id ? "rtl" : "ltr",
      }}
      ref={messages.length - 1 === index ? lastMessageRef : null}
      className="w-full relative p-2 lg:p-1 flex items-start justify-start gap-2 sm:gap-1 "
    >
      <div className="w-8 h-8 sm:w-6 sm:h-6 rounded-full">
        <img
          alt="profile-image"
          src={message.sender.profilePicture || avatar}
          className="w-full h-full rounded-full "
        />
      </div>
      <div
        className={`relative max-w-[70%] xs:max-w-full p-1 flex flex-col ${
          message.sender._id === currentUser?._id
            ? "bg-[#141722] "
            : "bg-[#343633] "
        } rounded-sm`}
      >
        <div
          style={{ direction: "ltr" }}
          className="flex justify-between items-center px-2 sm:px-1 gap-2 border-b border-gray-600"
        >
          <span className="text-[#64cf4f] text-xs truncate">
            {message.sender.name}
          </span>
          <span style={{ direction: "ltr" }} className="text-[#867272] text-xs">
            {date}
          </span>
        </div>
        <div className="w-full flex items-end  text-[#5fc1df] text-xs pt-1 pb-2">
          {message.message}
          {conversationReaded &&
            index === messages.length - 1 &&
            message.sender._id === currentUser?._id && (
              <span className="absolute bottom-0 left-0 text-xs text-gray-400  h-fit">
                <div className="text-xl lg:text-sm rotate-[8deg] lg:-mb-[10px] -mb-[15px]">
                  <FcCheckmark />
                </div>
                <div className="text-xl lg:text-sm rotate-[8deg]">
                  <FcCheckmark />
                </div>
              </span>
            )}
          {!conversationReaded &&
            index === messages.length - 1 &&
            message.sender._id === currentUser?._id && (
              <span className="absolute bottom-0 left-0 text-xs text-gray-400 h-fit opacity-20">
                <div className="text-xl lg:text-sm rotate-[8deg] lg:-mb-[10px] -mb-[15px] ">
                  <IoCheckmarkOutline />
                </div>
                <div className="text-xl lg:text-sm rotate-[8deg] ">
                  <IoCheckmarkOutline />
                </div>
              </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default PrivateMessageItem;
