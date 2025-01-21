import { Link } from "react-router-dom";
import { FcPaid } from "react-icons/fc";
import { resetModel } from "../../../context/StateManeger";
import { formateDate } from "../../../utils/common";
import { useAppDispatch } from "../../../context/Hooks";
import { IBuyFrameNotify } from "../../../types/notificationTypes";

type IProps = Omit<IBuyFrameNotify, "_id" | "isRead" | "type">;

const BuyFrameNotify = ({ createdAt, frame }: IProps) => {
  const dispatch = useAppDispatch();
  const date = formateDate(createdAt);

  return (
    <div className="flex flex-col gap-y-1 rounded-md border border-gray-700 bg-[#1010308e] p-1 sm:gap-y-2 sm:p-2">
      <div className="flex items-center gap-x-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-[4px] bg-[#7aec2e25]">
          <FcPaid className="text-xl" />
        </span>
        <h1 className="text-[#d67d54]">PURSHASING</h1>
        <span className="ml-auto text-sm text-[#928888]">{date}</span>
      </div>
      <p className="w-full text-xs text-[#bbc6d1] sm:text-sm">
        congratulation! for buying
        <Link
          to={`/marketplace?to=${frame._id}`}
          onClick={() => dispatch(resetModel())}
          className="mx-1 text-xs text-[#696cf3] underline sm:text-sm"
        >
          {frame.title}
        </Link>
        For
        <span className="mx-1 text-xs font-bold text-[#696cf3] sm:text-sm">{frame.price}</span>
        points
      </p>
      <Link
        to={`/myprofile?to=${frame._id}`}
        onClick={() => dispatch(resetModel())}
        className="ml-auto w-[90px] rounded-[4px] border border-gray-700 bg-[#3d4675ee] py-0.5 text-center text-sm text-[#eee] underline sm:py-1"
      >
        see that
      </Link>
    </div>
  );
};

export default BuyFrameNotify;
