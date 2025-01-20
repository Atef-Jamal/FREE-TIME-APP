import { Link } from "react-router-dom";
import { useAppSelector } from "../../context/Hooks";
import { IUser } from "../../types/userTypes";
import { crown, verifiedImage } from "../../assets";
import UserImage from "../Others/UserImage";

interface IProps {
  user: IUser;
  userHieghestPoints: string | undefined;
}

const LiveStatsItem = ({ user, userHieghestPoints }: IProps) => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const onlineUsers = useAppSelector((state) => state.stateManeger.onlineUsers);

  const { _id, name, points, emailVerified } = user;
  const isOnline = onlineUsers.includes(_id);
  const heighestUser = userHieghestPoints === _id;

  return (
    <Link
      to={currentUser?._id === _id ? "/myprofile" : `/user/${_id}`}
      className="relative flex h-[31px] min-w-[155px] items-center justify-between gap-x-1 rounded-sm bg-[#222339] px-1 text-sm text-gray-400 lg:h-[35px] lg:min-w-[190px] lg:px-2"
    >
      {heighestUser && (
        <span className="absolute -left-2 -top-2 h-5 w-5 -rotate-45">
          <img src={crown} alt="" />
        </span>
      )}
      <div className="h-[20px] w-[25px] lg:h-[27px] lg:w-[33px]">
        <UserImage user={user} />
      </div>
      <div className="flex flex-col">
        <span className="-mb-2 w-[80px] overflow-hidden truncate text-[9px] font-[400] tracking-wide text-[#dddbdb] sm:tracking-wider lg:-mb-1 lg:text-[11px] lg:font-bold">
          {name}
        </span>
        <div className="flex items-center gap-8">
          {isOnline && (
            <span className="text-[9px] font-bold tracking-wide text-[#68e44a] lg:text-[11px]">online</span>
          )}
          {!isOnline && (
            <span className="text-[9px] font-bold tracking-wide text-[#54724c] lg:text-[11px]">offline</span>
          )}
          {emailVerified && (
            <img src={verifiedImage} alt="" className="-mt-[2px] h-3 w-3 object-contain lg:h-4 lg:w-4" />
          )}
        </div>
      </div>
      <span className="flex h-6 min-w-9 items-center justify-center rounded-md bg-[#181616] px-1 text-xs text-[#c1f018] lg:h-7">
        {points}
      </span>
    </Link>
  );
};

export default LiveStatsItem;
