import { formateDate } from "../../../utils/common";
import { FcMusic } from "react-icons/fc";
import { Link } from "react-router-dom";
import { toggleThisEntity } from "../../../context/StateManeger";
import { useAppDispatch } from "../../../context/Hooks";
import { TypeMusicNotify } from "../../../types/notificationTypes";

type PropType = Omit<TypeMusicNotify, "_id" | "isRead" | "type">;

const BuyMusicNotify = ({
  musicTitle,
  createdAt,
  price,
  musicId,
}: PropType) => {
  const dispatch = useAppDispatch();
  const date = formateDate(createdAt);

  return (
    <div className="w-full flex flex-col items-center gap-2 xs:gap-1 bg-[#1010308e] rounded-md p-2 xs:p-1 border border-gray-700 ">
      <div className="flex gap-2 w-full">
        <span className="w-8 h-6 rounded-lg bg-[#7aec2e25] flex items-center justify-center">
          <FcMusic className=" text-xl" />
        </span>
        <h1 className="text-[#d67d54]">PURSHASING</h1>
        <span className="text-sm ml-auto text-[#7c7a7a] pr-1">{date}</span>
      </div>
      <p className="text-sm w-full text-[#bbc6d1]">
        congratulation! For Buying
        <span className="text-sm text-[#696cf3] mx-1 underline">
          {musicTitle}
        </span>
        for
        <span className="text-sm text-[#696cf3] mx-1">{price}</span> points
      </p>
      <Link
        to={`/myprofile?to=${musicId}`}
        onClick={() => {
          dispatch(
            toggleThisEntity({ entity: "openNotification", value: false })
          );
        }}
        className="text-sm bg-[#414a77ee] w-[100px] py-1 xs:py-[3px] rounded-md border border-gray-700 ml-auto text-center underline text-[#eee]"
      >
        see that
      </Link>
    </div>
  );
};

export default BuyMusicNotify;
