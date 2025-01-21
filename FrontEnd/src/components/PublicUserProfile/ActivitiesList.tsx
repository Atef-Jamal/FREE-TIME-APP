import { FcBusinessman, FcFrame, FcMusic } from "react-icons/fc";
import ActivityItem from "./ActivityItem";
import { AiFillGift } from "react-icons/ai";
import { IUser } from "../../types/userTypes";
import { INotifications } from "../../types/notificationTypes";
import { verifiedImage } from "../../assets";
import { empty } from "../../assets";

interface IProps {
  user: IUser | null;
  activities: INotifications[];
}

const ActivitiesList = ({ activities, user }: IProps) => {
  return (
    <div className="space-y-2">
      {activities.map((item, index) => {
        if (item.type === "REFERRER")
          return (
            <ActivityItem
              key={item._id}
              index={index}
              icon={<FcBusinessman className="text-2xl sm:text-xl" />}
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
              icon={<AiFillGift className="text-2xl sm:text-xl" />}
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
              icon={<FcFrame className="text-2xl sm:text-xl" />}
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
              icon={<AiFillGift className="text-2xl sm:text-xl" />}
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
              icon={<img src={verifiedImage} alt="" className="h-6 w-6 object-cover sm:h-4 sm:w-4" />}
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
              icon={<FcMusic className="text-2xl sm:text-xl" />}
              time={item.createdAt}
              message={`Music ${item.musicTitle} purshased `}
              price={item.price}
            />
          );
      })}
      {activities.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-y-3 py-2">
          <img src={empty} alt="Empty" className="h-10 w-10 object-contain opacity-50 md:h-12 md:w-12" />
          <p className="text-center text-sm font-bold text-gray-600 md:text-base">
            {user?.name} have No Activities right now
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivitiesList;
