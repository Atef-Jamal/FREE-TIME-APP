import {
  Dispatch,
  RefObject,
  SetStateAction,
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
import { makeRequest } from "../../../../utils";
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

interface TypeMessageProp {
  singleMessage: TypePublicChatMessage;
  lastMessageRef: RefObject<HTMLDivElement | null> | null;
  setOpenChatModelDeletion: Dispatch<
    SetStateAction<{
      messageId: string;
      messageUrlScreenshot: string;
    } | null>
  >;
}

type TypeFieldName = "loves" | "likes" | "dislikes";

const Message = ({
  singleMessage,
  lastMessageRef,
  setOpenChatModelDeletion,
}: TypeMessageProp) => {
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

  const [date, setDate] = useState(formateDate(createdAt));

  const dispatch = useAppDispatch();

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

  const handleDelete = async () => {
    const messageElement = document.getElementById(`publicMessage-${_id}`);
    let messageUrl = "";
    if (messageElement) {
      messageElement.style.backgroundColor = "#16162c";
      const canvas = await html2canvas(messageElement);
      messageElement.style.backgroundColor = "";
      messageUrl = canvas.toDataURL("image/png");
    }

    setOpenChatModelDeletion({
      messageId: _id,
      messageUrlScreenshot: messageUrl,
    });
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

  useListenToSocketEvents({
    eventsToListen: ["interact-with-public-message", "user-updated"],
    handlers: [handleUpdateMessage, handleUpdateUser],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(formateDate(createdAt));
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [createdAt]);

  const onUpdate = ({ detail }: { detail: TypePublicChatMessage }) => {
    if (detail._id === _id) {
      setMessageItem(detail);
    }
    return;
  };

  useListenToDocumentEvent({
    eventToListen: "fastDeletePublicMessage",
    onUpdate,
  });

  return (
    <div
      ref={lastMessageRef}
      id={`publicMessage-${_id}`}
      className={`bg-[#2f2f4e88] w-full flex flex-col gap-1  rounded-md p-[6px]`}
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
          <span className="block text-[#76ee52] text-[12px] sm:text-[10px] font-bold capitalize -mb-[10px]">
            {sender?.name}
          </span>
          {createdAt && (
            <span className="text-[12px] sm:text-[10px] text-[#857272] font-bold">
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
            onClick={handleDelete}
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
            {isSended === "SUCCESS" && <FcOk className="mr-auto " />}

            {isSended === "PENDING" && (
              <BiCircle className="mr-auto opacity-70" />
            )}

            {isSended === "FAILED" && (
              <IoCloseCircleOutline className="mr-auto " />
            )}

            <button
              onClick={() => reactToMessage("loves", "dislikes", "likes")}
              className="flex items-center gap-1 "
            >
              <FcLike className="text-sm opacity-70" />
              <span className="text-xs text-yellow-500 font-bold -mb-[2px]">
                {loves.length || 0}
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
              onClick={() => reactToMessage("dislikes", "likes", "loves")}
              className="flex items-center gap-1"
            >
              <AiTwotoneDislike className="text-sm opacity-40" />
              <span className="text-xs text-yellow-500 font-bold -mb-[2px]">
                {dislikes.length || 0}
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
