import { FcBusinessman, FcFrame, FcMusic } from "react-icons/fc";
import ActivityItem from "./ActivityItem";
import { AiFillGift } from "react-icons/ai";
import verifiedIcon from "../../assets/verified-icon.png";
import { empty } from "../../assets";
import { User } from "../../types/user";
import { TypeNotifications } from "../../types/notification";

const ActivitiesList = ({
  activities,
  user,
}: {
  user: User | null;
  activities: TypeNotifications[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      {activities.map((item, index) => {
        if (item.type === "REFERRER")
          return (
            <ActivityItem
              key={item._id}
              index={index}
              icon={<FcBusinessman className="text-xl" />}
              time={item.createdAt}
              message={`${user?.name} successfully Referred his friend ${item.referredUser.name}`}
              prize={item.prize}
            />
          );
        if (item.type === "QUIZ-APP")
          return (
            <ActivityItem
              key={item._id}
              index={index}
              icon={<AiFillGift className="text-xl" />}
              time={item.createdAt}
              message="Quiz app completed"
              prize={item.prize}
            />
          );
        if (item.type === "BUY-FRAME") {
          return (
            <ActivityItem
              key={item._id}
              index={index}
              icon={<FcFrame className="text-xl" />}
              time={item.createdAt}
              message={`Buyed ${item.frame.title}`}
              price={item.frame.price}
            />
          );
        }
        if (item.type === "GUESS-CARD")
          return (
            <ActivityItem
              key={item._id}
              index={index}
              icon={<AiFillGift className="text-xl" />}
              time={item.createdAt}
              message={"Guess Card Game Completed "}
              prize={item.prize}
            />
          );
        if (item.type === "EMAIL-VERIFIED")
          return (
            <ActivityItem
              key={item._id}
              index={index}
              icon={<img src={verifiedIcon} alt="" className="w-5 h-5" />}
              time={item.createdAt}
              message="Verified His Email successfully"
              prize={item.prize}
            />
          );
        if (item.type === "MUSIC")
          return (
            <ActivityItem
              key={item._id}
              index={index}
              icon={<FcMusic className="text-xl" />}
              time={item.createdAt}
              message={`Music ${item.musicTitle} Buyed Now`}
              prize={item.price}
            />
          );
      })}
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 p-2">
          <img alt={""} src={empty} />
          <span className="text-gray-400 tracking-wider font-bold sm:text-sm ">
            Empty
          </span>
          <span className="text-gray-400 tracking-wider sm:text-sm ">
            {`${user?.name || "this person"} Has No Activity Right Now`}
          </span>
        </div>
      ) : undefined}
    </div>
  );
};

export default ActivitiesList;
