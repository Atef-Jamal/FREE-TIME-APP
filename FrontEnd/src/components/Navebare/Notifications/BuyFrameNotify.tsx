import { Link } from "react-router-dom";
import { FcPaid } from "react-icons/fc";
import { toggleThisEntity } from "../../../context/StateManeger";
import { formateDate } from "../../../utils/common";
import { useAppDispatch } from "../../../context/Hooks";
import { TypeBuyFrameNotify } from "../../../types/notificationTypes";

type PropType = Omit<TypeBuyFrameNotify, "_id" | "isRead" | "type">;

const BuyFrameNotify = ({ createdAt, frame }: PropType) => {
  const dispatch = useAppDispatch();

  const date = formateDate(createdAt);

  return (
    <div className="w-full flex flex-col items-center gap-2 xs:gap-1 bg-[#1010308e] rounded-md p-2 xs:p-1 border border-gray-700 ">
      <div className="flex gap-2 w-full">
        <span className="w-8 h-6 rounded-lg bg-[#7aec2e25] flex items-center justify-center">
          <FcPaid className=" text-xl" />
        </span>
        <h1 className="text-[#d67d54]">PURSHASING</h1>
        <span className="text-xs ml-auto text-[#9b9090] pr-1">{date}</span>
      </div>
      <p className="text-sm w-full text-[#bbc6d1] sm:text-xs">
        congratulation! for buying
        <Link
          to={`/marketplace?to=${frame._id}`}
          onClick={() => {
            dispatch(
              toggleThisEntity({ entity: "openNotification", value: false })
            );
          }}
          className="text-sm text-[#696cf3] mx-1 underline sm:text-xs"
        >
          {frame.title}
        </Link>
        For
        <span className="text-sm text-[#696cf3] mx-1 font-bold sm:text-xs">
          {frame.price}
        </span>
        points
      </p>
      <Link
        to={`/myprofile?to=${frame._id}`}
        onClick={() => {
          dispatch(
            toggleThisEntity({ entity: "openNotification", value: false })
          );
        }}
        className="text-sm bg-[#3d4675ee] w-[100px] py-1 xs:py-[3px] rounded-md border border-gray-700 ml-auto text-center underline text-[#eee]"
      >
        see that
      </Link>
    </div>
  );
};

export default BuyFrameNotify;
