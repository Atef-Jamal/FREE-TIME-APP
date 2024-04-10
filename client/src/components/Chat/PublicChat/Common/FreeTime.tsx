import { timeAgoFromMongoDBDate } from "../../../../context/functions";
import { TypePublicChatFreeTime } from "../../../../types";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../../context/Hooks";

const FreeTime = ({
  singleMessage,
  lastMessageRef,
}: {
  singleMessage: TypePublicChatFreeTime;
  lastMessageRef?: React.RefObject<HTMLDivElement> | null;
}) => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const date = timeAgoFromMongoDBDate(singleMessage.createdAt.toString());
  return (
    <div
      ref={lastMessageRef}
      className="w-full p-2 flex flex-col items-center justify-center gap-2 bg-[#2f2f4e88] rounded-md"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex ">
          <span className="px-3 py-1 bg-[#89c558] rounded-sm text-xs font-[900] tracking-wider text-blue-800 mr-2">
            BOT
          </span>
          <span className="text-l tracking-wider text-[#01D676] font-bold">
            FREE
          </span>
          <span className="text-l text-gray-300 tracking-wider font-bold">
            TIME
          </span>
        </div>
        <span className="text-xs text-gray-500 font-bold">{date}</span>
      </div>
      {singleMessage.typeOfTask === "TASK" && (
        <p className="text-sm text-[#d9dfdb] ">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="text-sm text-[#8be263ee] font-bold mr-2 underline"
          >
            {singleMessage.sender.name}
          </Link>
          Completed Task Now
        </p>
      )}
      {singleMessage.typeOfTask === "EMAIL-VERIFIED" && (
        <p className="text-sm text-[#d9dfdb]">
          <span className="text-sm text-[#8be263ee] font-bold mr-2 underline">
            {singleMessage.sender.name}
          </span>
          verified his Email Now
        </p>
      )}
      {singleMessage.typeOfTask === "REFERRER" && (
        <p className="text-sm text-[#d9dfdb]">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="text-sm text-[#8be263ee] font-bold mr-2 underline"
          >
            {singleMessage.sender.name}
          </Link>
          Referred His Friend{" "}
          <Link
            to={`/user/${singleMessage._id}`}
            className="text-sm text-[#8be263ee] font-bold mr-2 underline"
          >
            {singleMessage.newUserReferred.name}
          </Link>{" "}
          Now
        </p>
      )}
      {singleMessage.typeOfTask === "MUSIC" && (
        <p className="text-sm text-[#d9dfdb]">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="text-sm text-[#8be263ee] font-bold mr-2 underline"
          >
            {singleMessage.sender.name}
          </Link>
          Purshased {singleMessage.musicTitle} Music Now
        </p>
      )}
      {singleMessage.typeOfTask === "FRAME" && (
        <p className="text-sm text-[#d9dfdb]">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="text-sm text-[#8be263ee] font-bold mr-2 underline"
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
