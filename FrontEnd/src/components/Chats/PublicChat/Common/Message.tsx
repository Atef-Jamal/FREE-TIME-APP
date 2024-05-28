import { useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";
import { FcLike, FcOk } from "react-icons/fc";
import { showPopup } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import UserImage from "../../../../components/Others/UserImage";
import { makeRequest } from "../../../../utils";
import { TypePublicChatMessage } from "../../../../types/publicChatTypes";
import { useListenToSocketEvent } from "../../../../hooks";
import { User } from "../../../../types/userTypes";
import { formateDate, handleApiError } from "../../../../utils/common";
import { verifiedImage } from "../../../../assets";
import { BiCircle } from "react-icons/bi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";

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
  const { currentUser, socket } = useAppSelector((state) => state.stateManeger);
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
    isSended,
  } = messageItem;

  const dispatch = useAppDispatch();
  const date = formateDate(createdAt);

  const deleteMessage = async (messageId: string) => {
    setIsDeleting(true);
    try {
      if (stopScrolling === false) {
        setStopScrolling(true);
      }
      setMessageItem((prev) => ({ ...prev, isDeleted: true }));
      const response = await makeRequest.patch(`api/publicchat/${messageId}`, {
        isDeleted: true,
      });
      socket?.emit("interact-with-public-message", response.data);
    } catch (error) {
      setMessageItem((prev) => ({ ...prev, isDeleted: false }));
      dispatch(
        showPopup({
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

    const restoreOldMessageIfIsError = messageItem;

    setMessageItem(updateMessage);
    try {
      const response = await makeRequest.patch(
        `api/publicchat/${_id}/${fieldName}`,
        { FOR_CONSISTENCY: "FOR_CONSISTENCY" }
      );
      socket?.emit("interact-with-public-message", response.data);
    } catch (error) {
      setMessageItem(restoreOldMessageIfIsError);
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        })
      );
    }
  };
  const handleUpdateMessage = (updatedMessage: TypePublicChatMessage) => {
    if (updatedMessage._id === _id) {
      setMessageItem(updatedMessage);
    }
  };
  const handleUpdateUser = (updatedUser: User) => {
    if (sender._id === updatedUser._id) {
      setMessageItem((prevMessageItem) => ({
        ...prevMessageItem,
        sender: updatedUser,
      }));
    }
  };

  useListenToSocketEvent<TypePublicChatMessage>({
    eventToListen: "interact-with-public-message",
    onUpdate: handleUpdateMessage,
  });

  useListenToSocketEvent<User>({
    eventToListen: "user-updated",
    onUpdate: handleUpdateUser,
  });

  return (
    <div
      ref={messageRef}
      id={_id}
      className={`bg-[#2f2f4e88] relative w-full flex flex-col gap-1  rounded-md p-[6px]`}
    >
      <div className="w-full flex relative ">
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
          <img
            src={verifiedImage}
            alt=""
            className="w-4 h-4 object-cover mx-2 "
          />
        )}
        {currentUser?._id === sender._id && !isDeleted && (
          <button
            onClick={() => deleteMessage(_id)}
            disabled={isDeleting}
            className="ml-auto flex items-center justify-center rounded-sm"
          >
            <FaRegTrashCan className="text-lg sm:text-sm opacity-70" />
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
          <div className="flex items-center justify-end gap-3 ml-auto w-full">
            {isSended !== undefined && isSended === "SUCCESS" && (
              <FcOk className="mr-auto " />
            )}

            {isSended !== undefined && isSended === "PENDING" && (
              <BiCircle className="mr-auto opacity-70" />
            )}

            {isSended !== undefined && isSended === "FAILED" && (
              <IoCloseCircleOutline className="mr-auto " />
            )}
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
