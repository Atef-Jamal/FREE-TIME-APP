import { User } from "../../types/userTypes";
import Image from "./Image";

interface TypeProps {
  user: User | null;
}

const UserImage = ({ user }: TypeProps) => {
  if (!user) return;
  return (
    <div className={`relative w-full h-full rounded-sm `}>
      {user.activeFrame ? (
        // <img
        //   className=" absolute top-0 w-full h-full rounded-sm"
        //   src={user.activeFrame.image}
        //   alt=""
        // />
        <Image
          alt={user.name}
          src={user.activeFrame.image}
          className="absolute top-0 w-full h-full rounded-sm"
        />
      ) : undefined}
      {/* <img
        className={`absolute transition-all ${
          user.activeFrame
            ? "top-[15%] left-[14%] w-[70%] h-[70%] rounded-sm"
            : "w-full h-full rounded-md "
        } `}
        src={user.profilePicture}
        alt=""
      /> */}
      <Image
        alt={user.name}
        src={user.profilePicture}
        className={`absolute transition-all ${
          user.activeFrame
            ? "top-[15%] left-[14%] w-[70%] h-[70%] rounded-sm"
            : "w-full h-full rounded-md "
        } `}
      />
    </div>
  );
};

export default UserImage;
