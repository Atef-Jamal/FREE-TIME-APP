import { avatar } from "../../assets";
import { User } from "../../types/user";

interface TypeProps {
  user: User | null;
}

const UserImage = ({ user }: TypeProps) => {
  return (
    <>
      {user?.profilePicture ? (
        <div className={`relative w-full h-full rounded-sm `}>
          {user.activeFrame ? (
            <img
              className=" absolute top-0 w-full h-full rounded-sm"
              src={user.activeFrame.image}
              alt="frame"
            />
          ) : undefined}
          <img
            className={`absolute transition-all ${
              user.activeFrame
                ? "top-[15%] left-[14%] w-[70%] h-[70%] rounded-sm"
                : "w-full h-full rounded-md "
            } `}
            src={`${import.meta.env.VITE_SERVER_BASE_URL}/${
              user.profilePicture
            }`}
            alt="user img"
          />
        </div>
      ) : (
        <div className={`relative w-full h-full rounded-sm transition-all`}>
          {user?.activeFrame ? (
            <img
              className=" absolute top-0 w-full h-full rounded-md"
              src={user.activeFrame.image}
              alt="frame"
            />
          ) : undefined}
          <img
            className={`absolute transition-all  ${
              user?.activeFrame
                ? "top-[15%] left-[14%] w-[70%] h-[70%] rounded-sm"
                : "w-full h-full rounded-md "
            } `}
            src={avatar}
            alt="avatar"
          />
        </div>
      )}
    </>
  );
};

export default UserImage;
