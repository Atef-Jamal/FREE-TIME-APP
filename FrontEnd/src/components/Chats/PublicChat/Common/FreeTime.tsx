import { formateDate } from "../../../../utils/common";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../../context/Hooks";
import { TypePublicChatFreeTime } from "../../../../types/publicChat";
import { verifiedImage } from "../../../../assets";

const FreeTime = ({
  singleMessage,
  messageRef,
}: {
  singleMessage: TypePublicChatFreeTime;
  messageRef: React.RefObject<HTMLDivElement> | null;
}) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const date = formateDate(singleMessage.createdAt.toString());
  return (
    <div
      ref={messageRef}
      className="w-full p-2 flex flex-col items-center justify-center gap-2 bg-[#2f2f4e88] rounded-md"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <span className="p-1 flex items-center justify-center bg-[#854f22c7] rounded-md text-[9px] font-extrabold tracking-wider text-[#5dce67] mr-1">
            BOT
          </span>
          <span className=" text-sm tracking-wider text-[#01D676] font-bold">
            FREE
          </span>
          <span className="text-sm text-gray-300 tracking-wider font-bold">
            TIME
          </span>
        </div>
        <span className="text-xs text-gray-500 font-bold">{date}</span>
      </div>
      {singleMessage.typeOfTask === "TASK" && (
        <p className="text-xs text-[#d9dfdb] mr-auto">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="text-xs text-[#6385e2ee] font-bold mr-2 underline"
          >
            {singleMessage.sender.name}
          </Link>
          Completed Task Now
        </p>
      )}
      {singleMessage.typeOfTask === "EMAIL-VERIFIED" && (
        <p className="text-sm text-[#d9dfdb] mr-auto flex items-center">
          <span className="text-xs text-[#6385e2ee] font-bold underline">
            {singleMessage.sender.name}
          </span>
          <img
            src={verifiedImage}
            alt=""
            className="w-4 h-4 object-cover mx-2 "
          />
          verified his Email Now
        </p>
      )}
      {singleMessage.typeOfTask === "REFERRER" && (
        <p className="text-xs text-[#d9dfdb] mr-auto">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="text-xs text-[#6385e2ee] font-bold mr-1 underline"
          >
            {singleMessage.sender.name}
          </Link>
          Referred His Friend
          <Link
            to={`/user/${singleMessage._id}`}
            className=" text-[#6385e2ee] font-bold mx-[3px] underline"
          >
            {singleMessage.newUserReferred.name}
          </Link>
          Now
        </p>
      )}
      {singleMessage.typeOfTask === "MUSIC" && (
        <p className="text-xs text-[#d9dfdb] mr-auto">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="text-xs text-[#6385e2ee] font-bold mr-2 underline"
          >
            {singleMessage.sender.name}
          </Link>
          Purshased {singleMessage.musicTitle} Music Now
        </p>
      )}
      {singleMessage.typeOfTask === "FRAME" && (
        <p className="text-xs text-[#d9dfdb] mr-auto">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="text-xs text-[#6385e2ee] font-bold mr-2 underline"
          >
            {singleMessage.sender.name}
          </Link>
          Purshased Frame Now
        </p>
      )}
    </div>
  );
};

export default FreeTime;
