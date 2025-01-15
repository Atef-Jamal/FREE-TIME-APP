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
      className={`special-for-deleting-${messageItem._id} flex flex-col gap-1 rounded-md bg-[#2f2f4e88] p-[6px]`}
    >
      <div className="relative flex w-full">
        <div className="h-[30px] w-[35px] sm:h-[25px] sm:w-[30px]">
          <UserImage user={messageItem.sender} />
        </div>
        <Link
          to={currentUserId === messageItem.sender._id ? "/myprofile" : `/user/${messageItem.sender._id}`}
          className={`-mt-1 ml-2 max-w-[60%] overflow-hidden sm:ml-[6px]`}
        >
          <span className="-mb-[6px] flex items-center text-sm font-bold capitalize text-[#6dca51]">
            {messageItem.sender?.name}
            {messageItem.sender.emailVerified && (
              <img src={verifiedImage} alt="" className="mx-2 h-4 w-4 object-cover sm:h-[14px] sm:w-[14px]" />
            )}
          </span>
          {messageItem.createdAt && <span className="text-xs font-bold text-[#857272]">{date}</span>}
        </Link>

        {currentUserId === messageItem.sender._id && !messageItem.isDeleted && (
          <button onClick={handleDelete} className="ml-auto flex items-center justify-center rounded-sm">
            <FaRegTrashCan className="text-lg opacity-70 sm:text-sm" />
          </button>
        )}
      </div>

      {!messageItem.isDeleted ? (
        <div className="w-full pl-[3px]">
          <p className="w-full break-words p-[2px] text-sm text-[#97b5f7]">
            {messageItem.mentioned && (
              <Link
                to={`/user/${messageItem.mentioned._id}`}
                className="mr-2 text-xs font-extrabold text-blue-700 sm:text-[10.5px]"
              >
                @{messageItem.mentioned.name}
              </Link>
            )}
            {messageItem.message}
          </p>
          <div className="ml-auto flex w-full items-center justify-end gap-3">
            {messageItem.isSended === "SUCCESS" && <FcOk className="mr-auto" />}

            {messageItem.isSended === "PENDING" && <BiCircle className="mr-auto opacity-70" />}

            {messageItem.isSended === "FAILED" && <IoCloseCircleOutline className="mr-auto" />}

            <button onClick={handleLove} className="flex items-center gap-1">
              <FcLike className="text-sm opacity-70" />
              <span className="-mb-[2px] text-xs font-bold text-yellow-500">
                {messageItem.loves.length || 0}
              </span>
            </button>

            <button onClick={handleLike} className="flex items-center gap-1">
              <AiTwotoneLike className="text-sm opacity-40" />
              <span className="-mb-[2px] text-xs font-bold text-yellow-500">
                {messageItem.likes.length || 0}
              </span>
            </button>
            <button onClick={handleDisLike} className="flex items-center gap-1">
              <AiTwotoneDislike className="text-sm opacity-40" />
              <span className="-mb-[2px] text-xs font-bold text-yellow-500">
                {messageItem.dislikes.length || 0}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-1 flex items-center justify-center text-[12px] font-extrabold italic text-[#df9149af]">
          DELETED BY
          <span className="ml-1 text-[12px] italic text-gray-400">{messageItem.sender.name}</span>
        </p>
      )}
    </div>
  );
});

export default Message;
