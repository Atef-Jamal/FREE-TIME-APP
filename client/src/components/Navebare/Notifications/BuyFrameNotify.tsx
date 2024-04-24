import { Link } from "react-router-dom";
import { FcPaid } from "react-icons/fc";
import { toggleThisEntity } from "../../../context/StateManeger";
import { timeAgoFromMongoDBDate } from "../../../context/functions";
import { useAppDispatch } from "../../../context/Hooks";
import { TypeBuyFrameNotify } from "../../../types/notification";

type PropType = Omit<TypeBuyFrameNotify, "_id" | "isRead" | "type">;

const BuyFrameNotify = ({ createdAt, frame }: PropType) => {
  const dispatch = useAppDispatch();

  const date = timeAgoFromMongoDBDate(createdAt.toString());

  return (
    <div className="w-full flex flex-col items-center gap-2 xs:gap-1 bg-[#1010308e] rounded-md p-2 xs:p-1 border border-gray-700 ">
      <div className="flex gap-2 w-full">
        <span className="w-8 h-6 rounded-lg bg-[#7aec2e25] flex items-center justify-center">
          <FcPaid className=" text-xl" />
        </span>
        <h1 className="text-[#d67d54]">PURSHASING</h1>
        <span className="text-sm ml-auto text-[#7c7a7a] pr-1">{date}</span>
      </div>
      <p className="text-sm w-full text-[#bbc6d1]">
        congratulation! for buying
        <Link
          to={"/myprofile?to=frames"}
          onClick={() =>
            dispatch(
              toggleThisEntity({ entity: "openNotification", value: false })
            )
          }
          className="text-sm text-[#696cf3] mx-1 underline "
        >
          {frame.title}
        </Link>
        for
        <span className="text-sm text-[#696cf3] mx-1 font-bold">
          {frame.price}
        </span>
        points
      </p>
      <Link
        to={"/myprofile?to=frames"}
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
