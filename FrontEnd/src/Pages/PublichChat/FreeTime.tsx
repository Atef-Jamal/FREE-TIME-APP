import { Link } from "react-router-dom";
import { formateDate } from "../../utils/common";
import { useAppSelector } from "../../context/Hooks";
import { IPublicChatFreeTime } from "../../types/publicChatTypes";
import { verifiedImage } from "../../assets";

interface IProps {
  singleMessage: IPublicChatFreeTime;
  lastMessageRef: React.RefObject<HTMLDivElement | null> | null;
}

const FreeTime = ({ singleMessage, lastMessageRef }: IProps) => {
  const currentUser = useAppSelector((state) => state.appState.currentUser);
  const date = formateDate(singleMessage.createdAt);
  return (
    <div ref={lastMessageRef} className="space-y-2 rounded-md bg-[#2f2f4e88] p-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex">
          <span className="mr-1 flex items-center justify-center rounded-md bg-[#854f22c7] p-1 text-[9px] font-extrabold tracking-wider text-[#5dce67]">
            BOT
          </span>
          <span className="text-sm font-bold tracking-wider text-[#01D676]">FREE</span>
          <span className="text-sm font-bold tracking-wider text-gray-300">TIME</span>
        </div>
        <span className="text-xs font-bold text-gray-500">{date}</span>
      </div>
      {singleMessage.typeOfTask === "TASK" && (
        <p className="mr-auto text-xs text-[#d9dfdb]">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="mr-2 text-xs font-bold text-[#6385e2ee] underline"
          >
            {singleMessage.sender.name}
          </Link>
          Completed Task Now
        </p>
      )}
      {singleMessage.typeOfTask === "EMAIL-VERIFIED" && (
        <p className="mr-auto flex items-center text-sm text-[#d9dfdb]">
          <span className="text-xs font-bold text-[#6385e2ee] underline">{singleMessage.sender.name}</span>
          <img src={verifiedImage} alt="" className="mx-2 h-4 w-4 object-cover" />
          verified his Email Now
        </p>
      )}
      {singleMessage.typeOfTask === "REFERRER" && (
        <p className="mr-auto text-xs text-[#d9dfdb]">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="mr-1 text-xs font-bold text-[#6385e2ee] underline"
          >
            {singleMessage.sender.name}
          </Link>
          Referred His Friend
          <Link to={`/user/${singleMessage._id}`} className="mx-[3px] font-bold text-[#6385e2ee] underline">
            {singleMessage.newUserReferred.name}
          </Link>
          Now
        </p>
      )}
      {singleMessage.typeOfTask === "MUSIC" && (
        <p className="mr-auto text-xs text-[#d9dfdb]">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="mr-2 text-xs font-bold text-[#6385e2ee] underline"
          >
            {singleMessage.sender.name}
          </Link>
          Purshased {singleMessage.musicTitle} Music Now
        </p>
      )}
      {singleMessage.typeOfTask === "FRAME" && (
        <p className="mr-auto text-xs text-[#d9dfdb]">
          <Link
            to={
              currentUser?._id === singleMessage.sender._id
                ? "/myprofile"
                : `/user/${singleMessage.sender._id}`
            }
            className="mr-2 text-xs font-bold text-[#6385e2ee] underline"
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
