import { GrAnnounce } from "react-icons/gr";
import { formateDate } from "../../../utils/common";
import { TypeAnnouncementNoify } from "../../../types/notificationTypes";

type PropType = Omit<TypeAnnouncementNoify, "_id" | "isRead" | "type">;

const AnnouncementNotify = ({ announceContent, createdAt }: PropType) => {
  const date = formateDate(createdAt);

  return (
    <div className="w-full flex flex-col items-center gap-2 xs:gap-1 bg-[#1010308e] rounded-md p-2 xs:py-1 border border-gray-700 ">
      <div className="flex gap-2 w-full">
        <span className="w-8 h-6 rounded-lg bg-[#7aec2e25] flex items-center justify-center">
          <GrAnnounce className=" text-xl" />
        </span>
        <h1 className="text-[#d67d54]">ANNOUNCEMENT</h1>
        <span className="text-xs ml-auto text-[#9b9090] pr-1">{date}</span>
      </div>
      <p className="text-sm w-full text-[#bbc6d1] sm:text-xs">{announceContent}</p>
    </div>
  );
};

export default AnnouncementNotify;
