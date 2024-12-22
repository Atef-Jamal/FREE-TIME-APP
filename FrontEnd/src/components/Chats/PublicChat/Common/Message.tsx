import {
  memo,
  // Dispatch,
  RefObject,
  // SetStateAction,
  useEffect,
  useState,
} from "react";
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
import html2canvas from "html2canvas";
import { useListenToDocumentEvent } from "../../../../hooks/listenersHooks";
import { useMutation } from "@tanstack/react-query";

interface TypeMessageProp {
  singleMessage: TypePublicChatMessage;
  lastMessageRef?: RefObject<HTMLDivElement | null> | null;
  handleOpenChatModelDeletion: (msgInfo: {
    messageId: string;
    messageUrlScreenshot: string;
  }) => void;
}

const Message = memo(
  ({
    singleMessage,
    lastMessageRef,
    handleOpenChatModelDeletion,
  }: TypeMessageProp) => {
    const currentUser = useAppSelector(
      (state) => state.stateManeger.currentUser
    );
    const socket = useAppSelector((state) => state.stateManeger.socket);
    const [messageItem, setMessageItem] =
      useState<TypePublicChatMessage>(singleMessage);
    const [date, setDate] = useState(formateDate(messageItem.createdAt));
    const dispatch = useAppDispatch();

    const mutation = useMutation({
      mutationFn: handleMessageReaction,
      onMutate: ({ fieldName, otherFieldOne, otherFieldTow }) => {
        if (!currentUser) {
          dispatch(
            showPopup({
              type: "ERROR_GENERAL",
              message: "Log in First",
            })
          );
          return;
        }
        const previousMessage = messageItem;
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
        return { previousMessage };
      },
      onError: (error, _, context) => {
        if (context) setMessageItem(context.previousMessage);
        dispatch(
          showPopup({
            type: "ERROR_GENERAL",
            message: handleApiError(error),
          })
        );
      },
      onSuccess: (newMessage) => {
        socket?.emit("interact-with-public-message", newMessage);
      },
    });

    const handleDelete = async () => {
      const messageElement = document.querySelector(
        `.special-for-deleting-${messageItem._id}`
      ) as HTMLElement;
      let messageUrl = "";
      if (messageElement) {
        messageElement.classList.add("bg-[#16162c]");
        const canvas = await html2canvas(messageElement);
        messageElement?.classList.remove("bg-[#16162c]");
        messageUrl = canvas.toDataURL("image/png");
      }

      handleOpenChatModelDeletion({
        messageId: messageItem._id,
        messageUrlScreenshot: messageUrl,
      });
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

    const onUpdate = ({ detail }: { detail: TypePublicChatMessage }) => {
      if (detail._id === messageItem._id) {
        setMessageItem(detail);
      }
      return;
    };

    useListenToDocumentEvent({
      eventToListen: "fastDeletePublicMessage",
      onUpdate,
    });

    const handleLove = () => {
      if (!currentUser) {
        dispatch(
          showPopup({
            type: "ERROR_GENERAL",
            message: "Log in First",
          })
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
      if (!currentUser) {
        dispatch(
          showPopup({
            type: "ERROR_GENERAL",
            message: "Log in First",
          })
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
      if (!currentUser) {
        dispatch(
          showPopup({
            type: "ERROR_GENERAL",
            message: "Log in First",
          })
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
        // style={{
        //   boxSizing: "content-box",
        // }}
        className={`special-for-deleting-${messageItem._id} bg-[#2f2f4e88] w-full flex flex-col gap-1  rounded-md p-[6px]`}
      >
        <div className="w-full flex relative ">
          <div className="w-[35px] h-[30px] sm:w-[30px] sm:h-[25px]">
            <UserImage user={messageItem.sender} />
          </div>
          <Link
            to={
              currentUser?._id === messageItem.sender._id
                ? "/myprofile"
                : `/user/${messageItem.sender._id}`
            }
            className={`ml-2 sm:ml-[6px] max-w-[60%] h-full overflow-hidden `}
          >
            <span className="block text-[#76ee52] text-[12px] sm:text-[10px] font-bold capitalize -mb-[10px]">
              {messageItem.sender?.name}
            </span>
            {messageItem.createdAt && (
              <span className="text-[12px] sm:text-[10px] text-[#857272] font-bold">
                {date}
              </span>
            )}
          </Link>
          {messageItem.sender.emailVerified && (
            <img
              src={verifiedImage}
              alt=""
              className="w-4 h-4 object-cover mx-2 "
            />
          )}
          {currentUser?._id === messageItem.sender._id &&
            !messageItem.isDeleted && (
              <button
                onClick={handleDelete}
                className="ml-auto flex items-center justify-center rounded-sm"
              >
                <FaRegTrashCan className="text-lg sm:text-sm opacity-70" />
              </button>
            )}
        </div>

        {!messageItem.isDeleted ? (
          <div className="w-full pl-[3px]">
            <p className="break-words text-xs sm:text-[10.5px] text-[#3cdfd6] w-full p-[2px]">
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
              {messageItem.isSended === "SUCCESS" && (
                <FcOk className="mr-auto " />
              )}

              {messageItem.isSended === "PENDING" && (
                <BiCircle className="mr-auto opacity-70" />
              )}

              {messageItem.isSended === "FAILED" && (
                <IoCloseCircleOutline className="mr-auto " />
              )}

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
              <button
                onClick={handleDisLike}
                className="flex items-center gap-1"
              >
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
            <span className="text-[12px] italic ml-1 text-gray-400">
              {messageItem.sender.name}
            </span>
          </p>
        )}
      </div>
    );
  }
);

export default Message;
