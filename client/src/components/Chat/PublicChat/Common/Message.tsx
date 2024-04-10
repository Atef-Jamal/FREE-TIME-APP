import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { TypeFrame, TypePublicChatMessage } from "../../../../types";
import verifiedIcon from "../../../../assets/verified-icon.png";
import { timeAgoFromMongoDBDate } from "../../../../context/functions";
import { showPopup } from "../../../../context/StateManeger";
import { BsExclamationOctagonFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../../../context/Hooks";
import { UserImage } from "../../../../components";
import axios from "axios";

interface TypeMessageProp {
  singleMessage: TypePublicChatMessage;
  lastMessageRef?: React.RefObject<HTMLDivElement> | null;
  mentionedMessageRef?: React.RefObject<HTMLDivElement> | null;
  setStopScrolling?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Message = ({
  singleMessage,
  setStopScrolling,
  lastMessageRef,
  mentionedMessageRef,
}: TypeMessageProp) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { currentUser, token, socet } = useAppSelector(
    (state) => state.stateManeger
  );
  const [searchParams, setSearchParams] = useSearchParams();
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

  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };

  const date = timeAgoFromMongoDBDate(createdAt.toString());

  const deleteMessage = async (paramId: string) => {
    setIsDeleting(true);
    try {
      if (setStopScrolling !== undefined) {
        setStopScrolling(true);
      }
      const response = await axios.patch(
        `http://localhost:3000/api/publicchat/${paramId}`,
        { isDeleted: true },
        { headers }
      );
      socet?.emit("interact-with-public-message", response.data);
    } catch (err) {
      dispatch(
        showPopup({
          status: true,
          message: "Failing to Delete Message, May Be Your Connection Network ",
          icon: <BsExclamationOctagonFill />,
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const reactToMessage = async (arg: "loves" | "likes" | "dislikes") => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/publicchat/${_id}/${arg}`,
        { FOR_CONSISTENCY: "FOR_CONSISTENCY" },
        { headers }
      );
      if (response.status === 200) {
        socet?.emit("interact-with-public-message", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessage = (message: TypePublicChatMessage) => {
    if (message._id === _id) {
      setMessageItem(message);
    }
  };

  useEffect(() => {
    if (socet) {
      socet.on("interact-with-public-message", handleMessage);
      return () => {
        socet.off("interact-with-public-message", handleMessage);
      };
    }
  }, [socet]);

  const handleAddPhotoFrame = (data: {
    belongsTo: string;
    frameObj: TypeFrame;
  }) => {
    if (sender._id === data.belongsTo) {
      setMessageItem((prevMessageItem) => ({
        ...prevMessageItem,
        sender: { ...prevMessageItem.sender, activeFrame: data.frameObj },
      }));
    }
  };

  useEffect(() => {
    if (socet) {
      socet.on("user-photo-frame-changed", handleAddPhotoFrame);
      return () => {
        socet.off("user-photo-frame-changed", handleAddPhotoFrame);
      };
    }
  }, [socet]);

  return (
    <div
      ref={mentionedMessageRef || lastMessageRef}
      onClick={(e) => {
        e.currentTarget.classList.remove(
          "border",
          "animate-pulse",
          "border-gray-400"
        );
        if (mentionedMessageRef) {
          setSearchParams(() => {
            searchParams.delete("messageid");
            return searchParams;
          });
        }
      }}
      className={`bg-[#2f2f4e88] relative w-full flex flex-col gap-1  rounded-md p-[6px]`}
    >
      <div className="w-full flex ">
        <div className="w-[40px] h-[35px] sm:w-[30px] sm:h-[25px]">
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
          <span className="block text-[#76ee52] text-[12px] sm:text-[10px] font-bold capitalize -mb-[6px]">
            {sender?.name}
          </span>
          {createdAt ? (
            <span className="text-xs text-gray-500 font-bold">{date}</span>
          ) : null}
        </Link>
        {sender?.emailVerified && (
          <img alt="" src={verifiedIcon} className="w-5 h-5 ml-3" />
        )}
        {currentUser?._id === sender._id && !isDeleted && (
          <button
            onClick={() => deleteMessage(_id)}
            disabled={isDeleting}
            className="flex items-center justify-center gap-1  bg-[#fd444473] rounded-md px-[9px] py-[3px] ml-auto mb-3"
          >
            <MdDeleteOutline className="text-[13px]" />
            <span className="text-[9px] text-gray-300 mt-[2px]">DELETE</span>
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
              onClick={() => reactToMessage("dislikes")}
              className="flex items-center gap-1"
            >
              <AiTwotoneDislike className="text-sm opacity-40" />
              <span className="text-xs text-yellow-500 font-bold -mb-[2px]">
                {dislikes.length || 0}
              </span>
            </button>
            <button
              onClick={() => reactToMessage("likes")}
              className="flex items-center gap-1"
            >
              <AiTwotoneLike className="text-sm opacity-40" />
              <span className="text-xs text-yellow-500 font-bold -mb-[2px]">
                {likes.length || 0}
              </span>
            </button>
            <button
              onClick={() => reactToMessage("loves")}
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
