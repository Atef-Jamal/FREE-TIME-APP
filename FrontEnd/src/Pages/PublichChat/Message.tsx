import { memo, RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";
import { FcLike, FcOk } from "react-icons/fc";
import { openToast } from "../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { handleMessageReaction } from "../../services";
import { IPublicChatMessage } from "../../types/publicChatTypes";
import { useListenToSocketEvents } from "../../hooks/useListenToSocketEvents";
import { IUser } from "../../types/userTypes";
import { formateDate, handleApiError } from "../../utilities";
import { verifiedImage } from "../../assets";
import UserImage from "../../components/Shared/Common/UserImage";

interface IProps {
  singleMessage: IPublicChatMessage;
  lastMessageRef?: RefObject<HTMLDivElement | null> | null;
  handleSetMessageIdToDelete: (messageId: string) => void;
}

const Message = memo(({ singleMessage, lastMessageRef, handleSetMessageIdToDelete }: IProps) => {
  const currentUserId = useAppSelector((state) => state.appState.currentUser?._id);
  const currentUserStatus = useAppSelector((state) => state.appState.currentUserStatus);
  const socket = useAppSelector((state) => state.appState.socket);
  const [messageItem, setMessageItem] = useState<IPublicChatMessage>(singleMessage);
  const [date, setDate] = useState(formateDate(messageItem.createdAt));
  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: handleMessageReaction,
    onMutate: ({ fieldName, otherFieldOne, otherFieldTow }) => {
      if (!currentUserId) {
        dispatch(
          openToast({
            type: "ERROR_GENERAL",
            message: "Log in First",
          }),
        );
        return;
      }
      const previousMessage = messageItem;
      const updateMessage = (prev: IPublicChatMessage) => ({
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
        openToast({
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

  const handleUpdateMessage = useCallback(
    (updatedMessage: IPublicChatMessage) => {
      if (updatedMessage._id === messageItem._id) {
        setMessageItem(updatedMessage);
      }
    },
    [messageItem._id],
  );

  const handleUpdateUser = useCallback(
    (updatedUser: IUser) => {
      if (messageItem.sender._id === updatedUser._id) {
        setMessageItem((prevMessageItem) => ({
          ...prevMessageItem,
          sender: updatedUser,
        }));
      }
    },
    [messageItem.sender._id],
  );

  const events = useMemo(() => ["interact-with-public-message", "user-updated"], []);

  const handlers = useMemo(
    () => [handleUpdateMessage, handleUpdateUser],
    [handleUpdateMessage, handleUpdateUser],
  );

  useListenToSocketEvents({
    eventsToListen: events,
    handlers: handlers,
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
        openToast({
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
        openToast({
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
        openToast({
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
    <div ref={lastMessageRef} id={messageItem._id} className={"space-y-1 rounded-md bg-[#2f2f4e88] p-[6px]"}>
      <div className="relative flex w-full">
        <div className="h-[25px] w-[30px] md:h-[30px] md:w-[35px]">
          <UserImage user={messageItem.sender} />
        </div>
        <Link
          to={currentUserId === messageItem.sender._id ? "/myprofile" : `/user/${messageItem.sender._id}`}
          className={`-mt-[3px] ml-[6px] max-w-[60%] overflow-hidden md:ml-2`}
        >
          <span className="-mb-[8px] flex items-center text-xs font-[400] capitalize text-[#6dca51] md:text-sm">
            {messageItem.sender?.name}
            {messageItem.sender.emailVerified && (
              <img src={verifiedImage} alt="" className="mx-2 h-[14px] w-[14px] object-cover md:h-4 md:w-4" />
            )}
          </span>
          {messageItem.createdAt && <span className="text-[10px] font-bold text-[#857272]">{date}</span>}
        </Link>

        {currentUserId === messageItem.sender._id && !messageItem.isDeleted && (
          <button onClick={handleDelete} className="ml-auto flex items-center justify-center rounded-sm">
            <FaRegTrashCan className="text-sm opacity-70 md:text-lg" />
          </button>
        )}
      </div>

      {!messageItem.isDeleted ? (
        <div className="pl-[3px]">
          <p className="w-full break-words p-[2px] text-sm text-[#97b5f7]">
            {[...messageItem.mentionedUsers].map((user) => (
              <Link
                key={user._id}
                to={`/user/${user._id}`}
                className="mr-2 text-[10.5px] font-extrabold text-blue-700 sm:text-xs"
              >
                @{user.name}{" "}
              </Link>
            ))}

            {messageItem.message}
          </p>
          <div className="ml-auto flex w-full items-center justify-end gap-x-3">
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
