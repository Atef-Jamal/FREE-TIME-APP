import { FcBusinessman, FcFrame, FcMusic } from "react-icons/fc";
import ActivityItem from "./ActivityItem";
import { AiFillGift } from "react-icons/ai";
import { User } from "../../types/userTypes";
import { TypeNotifications } from "../../types/notificationTypes";
import Empty from "../Others/Empty";
import { verifiedImage } from "../../assets";

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
              icon={
                <img
                  src={verifiedImage}
                  alt=""
                  className="w-4 h-4 object-cover"
                />
              }
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
      {activities.length === 0 && (
        <div className="my-5">
          <Empty emptyText={`${user?.name} have No Activities right now`} />
        </div>
      )}
    </div>
  );
};

export default ActivitiesList;
