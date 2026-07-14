import { memo, RefObject, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { openToast, selectUserAuth } from "../../../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../../../context/hooks";
import type { IPublicChatItem, IPublicChatMessage } from "../types";
import { useSocketEvents } from "../../../../hooks/useSocketEvents";
import { cn, handleApiError } from "../../../../utils";
import { verifiedImage } from "../../../../assets";
import UserImage from "../../../../components/Shared/UserImage";
import RelativeCountdown from "../../../../components/Shared/TimeCountDown";
import { handleMessageReaction } from "../services";
import { updatePublicMsgCache } from "../cache";

interface IProps {
  singleMessage: IPublicChatMessage;
  lastMessageRef?: RefObject<HTMLDivElement | null> | null;
  handleSetMessageIdToDelete: (messageId: string) => void;
}

const Message = memo(({ singleMessage, lastMessageRef, handleSetMessageIdToDelete }: IProps) => {
  const currentUserId = useAppSelector((state) => state.appState.currentUser?._id);
  const userAuth = useAppSelector(selectUserAuth);
  const [messageItem, setMessageItem] = useState(singleMessage);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleMessageReaction,
    onMutate: ({ fieldName, otherField1, otherField2 }) => {
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
        [otherField1]: prev[otherField1].includes(currentUserId)
          ? prev[otherField1].filter((item) => item !== currentUserId)
          : prev[otherField1],
        [otherField2]: prev[otherField2].includes(currentUserId)
          ? prev[otherField2].filter((item) => item !== currentUserId)
          : prev[otherField2],
      });
      setMessageItem(updateMessage);
      return { previousMessage };
    },
    onSuccess: (newMessage) => {
      updatePublicMsgCache({ queryClient, newMessage });
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
  });

  const handleDelete = () => {
    handleSetMessageIdToDelete(messageItem._id);
  };

  const handleUpdateMessage = useCallback(
    (updatedMessage: IPublicChatItem) => {
      if (updatedMessage._id === messageItem._id && updatedMessage.type === "MESSAGE") {
        setMessageItem(updatedMessage);
      }
    },
    [messageItem._id],
  );

  useSocketEvents({
    public_chat_message_reaction: handleUpdateMessage,
  });

  const handleLove = () => {
    if (userAuth !== "authenticated") {
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
      otherField1: "dislikes",
      otherField2: "likes",
    });
  };

  const handleLike = () => {
    if (userAuth !== "authenticated") {
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
      otherField1: "dislikes",
      otherField2: "loves",
    });
  };

  const handleDisLike = () => {
    if (userAuth !== "authenticated") {
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
      otherField1: "likes",
      otherField2: "loves",
    });
  };

  return (
    <div
      ref={lastMessageRef}
      id={messageItem._id}
      className={cn(
        "space-y-1 rounded-md bg-[#2f2f4e88] p-[6px]",
        messageItem.isSended === "PENDING" && "opacity-50",
      )}
    >
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
          <RelativeCountdown targetIsoString={messageItem.createdAt} />
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
