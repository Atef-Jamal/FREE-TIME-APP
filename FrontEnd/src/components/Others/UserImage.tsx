import { User } from "../../types/userTypes";

interface TypeProps {
  user: User | null;
}

const UserImage = ({ user }: TypeProps) => {
  if (!user) return;
  return (
    <div className={`relative w-full h-full rounded-sm `}>
      {user.activeFrame ? (
        <img
          className=" absolute top-0 w-full h-full rounded-sm"
          src={user.activeFrame.image}
          alt=""
        />
      ) : undefined}
      <img
        className={`absolute transition-all ${
          user.activeFrame
            ? "top-[15%] left-[14%] w-[70%] h-[70%] rounded-sm"
            : "w-full h-full rounded-md "
        } `}
        src={`${import.meta.env.VITE_SERVER_BASE_URL}/${user.profilePicture}`}
        alt=""
      />
    </div>
  );
};

export default UserImage;
