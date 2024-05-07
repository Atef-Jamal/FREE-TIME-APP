import { useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { verifiedIcon } from "../../../../assets";
import { showPopup } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import UserImage from "../../../../components/Others/UserImage";
import { makeRequest } from "../../../../utils";
import { TypePublicChatMessage } from "../../../../types/publicChat";
import { useListenToEvent } from "../../../../hooks";
import { User } from "../../../../types/user";
import { formateDate, handleApiError } from "../../../../utils/common";

interface TypeMessageProp {
  singleMessage: TypePublicChatMessage;
  messageRef: React.RefObject<HTMLDivElement> | null;
  stopScrolling: boolean;
  setStopScrolling: React.Dispatch<React.SetStateAction<boolean>>;
}

type TypeFieldName = "loves" | "likes" | "dislikes";

const Message = ({
  singleMessage,
  setStopScrolling,
  stopScrolling,
  messageRef,
}: TypeMessageProp) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { currentUser, socet } = useAppSelector((state) => state.stateManeger);
  const [messageItem, setMessageItem] =
    useState<TypePublicChatMessage>(singleMessage);

  const {
    sender,
    createdAt,
    _id,
    message,
    isDeleted,
    dislikes,
    likes,
    loves,
    mentioned,
  } = messageItem;

  const dispatch = useAppDispatch();

  const date = formateDate(createdAt.toString());

  const deleteMessage = async (messageId: string) => {
    setIsDeleting(true);
    try {
      if (stopScrolling === false) {
        setStopScrolling(true);
      }
      const response = await makeRequest.patch(`api/publicchat/${messageId}`, {
        isDeleted: true,
      });
      socet?.emit("interact-with-public-message", response.data);
    } catch (error) {
      dispatch(
        showPopup({
          status: true,
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const reactToMessage = async (
    fieldName: TypeFieldName,
    otherFieldOne: TypeFieldName,
    otherFieldTow: TypeFieldName
  ) => {
    if (!currentUser) {
      dispatch(
        showPopup({
          status: true,
          type: "ERROR_GENERAL",
          message: "Log in First",
        })
      );
      return;
    }

    const updateMessage = (prev: TypePublicChatMessage) => ({
      ...prev,
      [fieldName]: prev[fieldName].includes(currentUser._id)
        ? prev[fieldName].filter((item) => item !== currentUser._id)
        : [...prev[fieldName], currentUser._id],
      [otherFieldOne]: prev[otherFieldOne].includes(currentUser._id)
        ? prev[otherFieldOne].filter((item) => item !== currentUser._id)
        : prev[otherFieldOne],
      [otherFieldTow]: prev[otherFieldTow].includes(currentUser._id)
        ? prev[otherFieldTow].filter((item) => item !== currentUser._id)
        : prev[otherFieldTow],
    });

    setMessageItem(updateMessage);
    try {
      const response = await makeRequest.patch(
        `api/publicchat/${_id}/${fieldName}`,
        { FOR_CONSISTENCY: "FOR_CONSISTENCY" }
      );
      if (response.status === 200) {
        socet?.emit("interact-with-public-message", response.data);
      }
    } catch (error) {
      dispatch(
        showPopup({
          status: true,
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    }
  };

  useListenToEvent<TypePublicChatMessage>({
    eventToListen: "interact-with-public-message",
    onUpdate: (updatedMessage) => {
      if (updatedMessage._id === _id) {
        setMessageItem(updatedMessage);
      }
    },
  });

  useListenToEvent<User>({
    eventToListen: "user-updated",
    onUpdate: (updatedUser) => {
      if (sender._id === updatedUser._id) {
        setMessageItem((prevMessageItem) => ({
          ...prevMessageItem,
          sender: updatedUser,
        }));
      }
    },
  });

  return (
    <div
      ref={messageRef}
      id={_id}
      className={`bg-[#2f2f4e88] relative w-full flex flex-col gap-1  rounded-md p-[6px]`}
    >
      <div className="w-full flex ">
        <div className="w-[35px] h-[30px] sm:w-[30px] sm:h-[25px]">
          <UserImage user={sender} />
        </div>
        <Link
          to={
            currentUser?._id === sender._id
              ? "/myprofile"
              : `/user/${sender._id}`
          }
          className={`ml-2 sm:ml-[6px] max-w-[60%] h-full overflow-hidden `}
        >
          <span className="block text-[#76ee52] text-[12px] sm:text-[10px] font-bold capitalize -mb-3">
            {sender?.name}
          </span>
          {createdAt && (
            <span className="text-[10px] sm:text-[8px] text-gray-500 font-bold">
              {date}
            </span>
          )}
        </Link>
        {sender?.emailVerified && (
          <img alt="" src={verifiedIcon} className="w-5 h-5 ml-3" />
        )}
        {currentUser?._id === sender._id && !isDeleted && (
          <button
            onClick={() => deleteMessage(_id)}
            disabled={isDeleting}
            className="ml-auto bg-[#f82a2a38] w-6 h-6 flex items-center justify-center rounded-md"
          >
            <MdDeleteOutline className="text-lg opacity-60" />
          </button>
        )}
      </div>

      {!isDeleted ? (
        <div className="w-full pl-[3px]">
          <p className="break-words text-xs sm:text-[10.5px] text-[#3cdfd6] w-full p-[2px]">
            {mentioned && (
              <Link
                to={`/user/${mentioned._id}`}
                className="text-xs sm:text-[10.5px] text-blue-700 font-extrabold mr-2"
              >
                @{mentioned.name}
              </Link>
            )}
            {message}
          </p>
          <div className="flex items-center justify-end gap-3 ml-auto w-[130px]  ">
            <button
              onClick={() => reactToMessage("dislikes", "likes", "loves")}
              className="flex items-center gap-1"
            >
              <AiTwotoneDislike className="text-sm opacity-40" />
              <span className="text-xs text-yellow-500 font-bold -mb-[2px]">
                {dislikes.length || 0}
              </span>
            </button>
            <button
              onClick={() => reactToMessage("likes", "dislikes", "loves")}
              className="flex items-center gap-1"
            >
              <AiTwotoneLike className="text-sm opacity-40" />
              <span className="text-xs text-yellow-500 font-bold -mb-[2px]">
                {likes.length || 0}
              </span>
            </button>
            <button
              onClick={() => reactToMessage("loves", "dislikes", "likes")}
              className="flex items-center gap-1 "
            >
              <FcLike className="text-sm opacity-70" />
              <span className="text-xs text-yellow-500 font-bold -mb-[2px]">
                {loves.length || 0}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <p className="flex items-center justify-center text-[12px] italic font-extrabold text-[#df9149af] mb-1">
          DELETED BY
          <span className="text-[12px] italic ml-1 text-gray-400">
            {sender.name}
          </span>
        </p>
      )}
    </div>
  );
};

export default Message;

// <div className={`${myMessage ? "gap-2" : ""} w-full flex items-center`}>
// <Skeleton className="w-[30px] h-[30px]" />
// <div className="max-w-[60%] flex flex-col gap-[6px] ml-2 ">
//   <Skeleton className="w-[150px] h-[7px]" />
//   <Skeleton className="w-[150px] h-[7px]" />
// </div>
// </div>
