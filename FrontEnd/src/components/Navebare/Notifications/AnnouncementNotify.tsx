import { GrAnnounce } from "react-icons/gr";
import { formateDate } from "../../../utils/common";
import { IAnnouncementNoify } from "../../../types/notificationTypes";

type IProps = Omit<IAnnouncementNoify, "_id" | "isRead" | "type">;

const AnnouncementNotify = ({ announceContent, createdAt }: IProps) => {
  const date = formateDate(createdAt);

  return (
    <div className="xs:gap-1 xs:py-1 flex w-full flex-col items-center gap-2 rounded-md border border-gray-700 bg-[#1010308e] p-2">
      <div className="flex w-full gap-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-lg bg-[#7aec2e25]">
          <GrAnnounce className="text-xl" />
        </span>
        <h1 className="text-[#d67d54]">ANNOUNCEMENT</h1>
        <span className="ml-auto pr-1 text-xs text-[#9b9090]">{date}</span>
      </div>
      <p className="w-full text-sm text-[#bbc6d1] sm:text-xs">{announceContent}</p>
    </div>
  );
};

export default AnnouncementNotify;
