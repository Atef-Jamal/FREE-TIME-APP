import { formateDate } from "../../../utils/common";
import { FcMusic } from "react-icons/fc";
import { Link } from "react-router-dom";
import { updateThisEntity } from "../../../context/StateManeger";
import { useAppDispatch } from "../../../context/Hooks";
import { IMusicNotify } from "../../../types/notificationTypes";

type IProps = Omit<IMusicNotify, "_id" | "isRead" | "type">;

const BuyMusicNotify = ({ musicTitle, createdAt, price, musicId }: IProps) => {
  const dispatch = useAppDispatch();
  const date = formateDate(createdAt);

  return (
    <div className="xs:gap-1 xs:p-1 flex w-full flex-col items-center gap-2 rounded-md border border-gray-700 bg-[#1010308e] p-2">
      <div className="flex w-full gap-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-lg bg-[#7aec2e25]">
          <FcMusic className="text-xl" />
        </span>
        <h1 className="text-[#d67d54]">PURSHASING</h1>
        <span className="ml-auto pr-1 text-xs text-[#9b9090]">{date}</span>
      </div>
      <p className="w-full text-sm text-[#bbc6d1] sm:text-xs">
        congratulation! For Buying
        <Link
          to={`/musics?to=${musicId}`}
          onClick={() => {
            dispatch(updateThisEntity({ entity: "openNotification", value: false }));
          }}
          className="mx-1 text-sm text-[#696cf3] underline sm:text-xs"
        >
          {musicTitle}
        </Link>
        For
        <span className="mx-1 text-sm text-[#696cf3] sm:text-xs">{price}</span> points
      </p>
      <Link
        to={`/myprofile?to=${musicId}`}
        onClick={() => {
          dispatch(updateThisEntity({ entity: "openNotification", value: false }));
        }}
        className="xs:py-[3px] ml-auto w-[100px] rounded-md border border-gray-700 bg-[#414a77ee] py-1 text-center text-sm text-[#eee] underline"
      >
        see that
      </Link>
    </div>
  );
};

export default BuyMusicNotify;
