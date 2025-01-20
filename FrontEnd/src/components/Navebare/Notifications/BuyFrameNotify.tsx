import { Link } from "react-router-dom";
import { FcPaid } from "react-icons/fc";
import { updateThisEntity } from "../../../context/StateManeger";
import { formateDate } from "../../../utils/common";
import { useAppDispatch } from "../../../context/Hooks";
import { IBuyFrameNotify } from "../../../types/notificationTypes";

type IProps = Omit<IBuyFrameNotify, "_id" | "isRead" | "type">;

const BuyFrameNotify = ({ createdAt, frame }: IProps) => {
  const dispatch = useAppDispatch();

  const date = formateDate(createdAt);

  return (
    <div className="xs:gap-1 xs:p-1 flex w-full flex-col items-center gap-2 rounded-md border border-gray-700 bg-[#1010308e] p-2">
      <div className="flex w-full gap-2">
        <span className="flex h-6 w-8 items-center justify-center rounded-lg bg-[#7aec2e25]">
          <FcPaid className="text-xl" />
        </span>
        <h1 className="text-[#d67d54]">PURSHASING</h1>
        <span className="ml-auto pr-1 text-xs text-[#9b9090]">{date}</span>
      </div>
      <p className="w-full text-sm text-[#bbc6d1] sm:text-xs">
        congratulation! for buying
        <Link
          to={`/marketplace?to=${frame._id}`}
          onClick={() => {
            dispatch(updateThisEntity({ entity: "openNotification", value: false }));
          }}
          className="mx-1 text-sm text-[#696cf3] underline sm:text-xs"
        >
          {frame.title}
        </Link>
        For
        <span className="mx-1 text-sm font-bold text-[#696cf3] sm:text-xs">{frame.price}</span>
        points
      </p>
      <Link
        to={`/myprofile?to=${frame._id}`}
        onClick={() => {
          dispatch(updateThisEntity({ entity: "openNotification", value: false }));
        }}
        className="xs:py-[3px] ml-auto w-[100px] rounded-md border border-gray-700 bg-[#3d4675ee] py-1 text-center text-sm text-[#eee] underline"
      >
        see that
      </Link>
    </div>
  );
};

export default BuyFrameNotify;
