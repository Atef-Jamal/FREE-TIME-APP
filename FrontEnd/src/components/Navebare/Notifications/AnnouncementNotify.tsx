import { GrAnnounce } from "react-icons/gr";
import { formateDate } from "../../../utils/common";
import { IAnnouncementNoify } from "../../../types/notificationTypes";

type IProps = Omit<IAnnouncementNoify, "_id" | "isRead" | "type">;

const AnnouncementNotify = ({ announceContent, createdAt }: IProps) => {
  const date = formateDate(createdAt);

  return (
    <div className="flex flex-col gap-y-1 rounded-md border border-gray-700 bg-[#1010308e] py-1 sm:gap-y-2 sm:p-2">
      <div className="flex items-center gap-x-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-[4px] bg-[#7aec2e25]">
          <GrAnnounce className="text-xl" />
        </span>
        <h1 className="text-[#d67d54]">ANNOUNCEMENT</h1>
        <span className="ml-auto text-sm text-[#928888]">{date}</span>
      </div>
      <p className="w-full text-xs text-[#bbc6d1] sm:text-sm">{announceContent}</p>
    </div>
  );
};

export default AnnouncementNotify;
