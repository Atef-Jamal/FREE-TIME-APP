import { IUser } from "../../features/user/types";

import { cn } from "../../utils";

interface IProps {
  user: Pick<IUser, "profilePicture" | "activeFrame"> | null;
}

const UserImage = ({ user }: IProps) => {
  if (!user) return;
  return (
    <div className={`relative h-full w-full rounded-sm`}>
      {user.activeFrame ? (
        <img className="absolute top-0 h-full w-full rounded-sm" src={user.activeFrame.image} alt="" />
      ) : undefined}
      <img
        className={cn(
          "absolute transition-all",
          user.activeFrame ? "left-[14%] top-[15%] h-[70%] w-[70%] rounded-sm" : "h-full w-full rounded-md",
        )}
        src={user.profilePicture}
        alt="user image"
      />
    </div>
  );
};

export default UserImage;
