import { memo, RefObject, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";
import { FcLike, FcOk } from "react-icons/fc";
import { showPopup } from "../../../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import UserImage from "../../../Others/UserImage";
import { handleMessageReaction } from "../../../../utils";
import { TypePublicChatMessage } from "../../../../types/publicChatTypes";
import { useListenToSocketEvents } from "../../../../hooks";
import { User } from "../../../../types/userTypes";
import { formateDate, handleApiError } from "../../../../utils/common";
import { verifiedImage } from "../../../../assets";
import { BiCircle } from "react-icons/bi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";

interface TypeMessageProp {
  singleMessage: TypePublicChatMessage;
  lastMessageRef?: RefObject<HTMLDivElement | null> | null;
  handleSetMessageIdToDelete: (messageId: string) => void;
}

const Message = memo(({ singleMessage, lastMessageRef, handleSetMessageIdToDelete }: TypeMessageProp) => {
  const currentUserId = useAppSelector((state) => state.stateManeger.currentUser?._id);
  const currentUserStatus = useAppSelector((state) => state.stateManeger.currentUserStatus);
  const socket = useAppSelector((state) => state.stateManeger.socket);
  const [messageItem, setMessageItem] = useState<TypePublicChatMessage>(singleMessage);
  const [date, setDate] = useState(formateDate(messageItem.createdAt));
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: handleMessageReaction,
    onMutate: ({ fieldName, otherFieldOne, otherFieldTow }) => {
      if (!currentUserId) {
        dispatch(
          showPopup({
            type: "ERROR_GENERAL",
            message: "Log in First",
          }),
        );
        return;
      }
      const previousMessage = messageItem;
      const updateMessage = (prev: TypePublicChatMessage) => ({
        ...prev,
        [fieldName]: prev[fieldName].includes(currentUserId)
          ? prev[fieldName].filter((item) => item !== currentUserId)
          : [...prev[fieldName], currentUserId],
        [otherFieldOne]: prev[otherFieldOne].includes(currentUserId)
          ? prev[otherFieldOne].filter((item) => item !== currentUserId)
          : prev[otherFieldOne],
        [otherFieldTow]: prev[otherFieldTow].includes(currentUserId)
          ? prev[otherFieldTow].filter((item) => item !== currentUserId)
          : prev[otherFieldTow],
      });
      setMessageItem(updateMessage);
      return { previousMessage };
    },
    onError: (error, _, context) => {
      if (context) setMessageItem(context.previousMessage);
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: handleApiError(error),
        }),
      );
    },
    onSuccess: (newMessage) => {
      socket?.emit("interact-with-public-message", newMessage);
    },
  });

  const handleDelete = () => {
    handleSetMessageIdToDelete(messageItem._id);
  };

  const handleUpdateMessage = (updatedMessage: TypePublicChatMessage) => {
    if (updatedMessage._id === messageItem._id) {
      setMessageItem(updatedMessage);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (messageItem.sender._id === updatedUser._id) {
      setMessageItem((prevMessageItem) => ({
        ...prevMessageItem,
        sender: updatedUser,
      }));
    }
  };

  useListenToSocketEvents({
    eventsToListen: ["interact-with-public-message", "user-updated"],
    handlers: [handleUpdateMessage, handleUpdateUser],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(formateDate(messageItem.createdAt));
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [messageItem.createdAt]);

  const handleLove = () => {
    if (currentUserStatus !== "authenticated") {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: "Log in First",
        }),
      );
      return;
    }
    mutation.mutate({
      messageId: messageItem._id,
      fieldName: "loves",
      otherFieldOne: "dislikes",
      otherFieldTow: "likes",
    });
  };

  const handleLike = () => {
    if (currentUserStatus !== "authenticated") {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: "Log in First",
        }),
      );
      return;
    }
    mutation.mutate({
      messageId: messageItem._id,
      fieldName: "likes",
      otherFieldOne: "dislikes",
      otherFieldTow: "loves",
    });
  };

  const handleDisLike = () => {
    if (currentUserStatus !== "authenticated") {
      dispatch(
        showPopup({
          type: "ERROR_GENERAL",
          message: "Log in First",
        }),
      );
      return;
    }
    mutation.mutate({
      messageId: messageItem._id,
      fieldName: "dislikes",
      otherFieldOne: "likes",
      otherFieldTow: "loves",
    });
  };

  return (
    <div
      ref={lastMessageRef}
      id={messageItem._id}
      className={`special-for-deleting-${messageItem._id} bg-[#2f2f4e88] w-full flex flex-col gap-1  rounded-md p-[6px]`}
    >
      <div className="w-full flex relative ">
        <div className="w-[35px] h-[30px] sm:w-[30px] sm:h-[25px]">
          <UserImage user={messageItem.sender} />
        </div>
        <Link
          to={currentUserId === messageItem.sender._id ? "/myprofile" : `/user/${messageItem.sender._id}`}
          className={`ml-2 sm:ml-[6px] max-w-[60%]  overflow-hidden -mt-1`}
        >
          <span className="flex items-center  text-[#6dca51] text-sm font-bold capitalize -mb-[6px]">
            {messageItem.sender?.name}
            {messageItem.sender.emailVerified && (
              <img
                src={verifiedImage}
                alt=""
                className="w-4 h-4 sm:w-[14px] sm:h-[14px] object-cover mx-2 "
              />
            )}
          </span>
          {messageItem.createdAt && <span className="text-xs text-[#857272] font-bold">{date}</span>}
        </Link>

        {currentUserId === messageItem.sender._id && !messageItem.isDeleted && (
          <button onClick={handleDelete} className="ml-auto flex items-center justify-center rounded-sm">
            <FaRegTrashCan className="text-lg sm:text-sm opacity-70" />
          </button>
        )}
      </div>

      {!messageItem.isDeleted ? (
        <div className="w-full pl-[3px]">
          <p className="break-words text-sm text-[#97b5f7] w-full p-[2px]">
            {messageItem.mentioned && (
              <Link
                to={`/user/${messageItem.mentioned._id}`}
                className="text-xs sm:text-[10.5px] text-blue-700 font-extrabold mr-2"
              >
                @{messageItem.mentioned.name}
              </Link>
            )}
            {messageItem.message}
          </p>
          <div className="flex items-center justify-end gap-3 ml-auto w-full">
            {messageItem.isSended === "SUCCESS" && <FcOk className="mr-auto " />}

            {messageItem.isSended === "PENDING" && <BiCircle className="mr-auto opacity-70" />}

            {messageItem.isSended === "FAILED" && <IoCloseCircleOutline className="mr-auto " />}

            <button onClick={handleLove} className="flex items-center gap-1 ">
              <FcLike className="text-sm opacity-70" />
              <span className="text-xs text-yellow-500 font-bold -mb-[2px]">
                {messageItem.loves.length || 0}
              </span>
            </button>

            <button onClick={handleLike} className="flex items-center gap-1">
              <AiTwotoneLike className="text-sm opacity-40" />
              <span className="text-xs text-yellow-500 font-bold -mb-[2px]">
                {messageItem.likes.length || 0}
              </span>
            </button>
            <button onClick={handleDisLike} className="flex items-center gap-1">
              <AiTwotoneDislike className="text-sm opacity-40" />
              <span className="text-xs text-yellow-500 font-bold -mb-[2px]">
                {messageItem.dislikes.length || 0}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <p className="flex items-center justify-center text-[12px] italic font-extrabold text-[#df9149af] mb-1">
          DELETED BY
          <span className="text-[12px] italic ml-1 text-gray-400">{messageItem.sender.name}</span>
        </p>
      )}
    </div>
  );
});

export default Message;
