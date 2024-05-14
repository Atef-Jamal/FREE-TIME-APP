import { empty } from "../../assets";

const Empty = ({
  emptyText,
  imgWidthHeight,
}: {
  emptyText: string;
  imgWidthHeight?: string;
}) => (
  <div className="w-full flex items-center justify-center gap-2 p-2">
    <img
      className={`object-cover ${imgWidthHeight || "w-12 h-12 xs:w-8 xs:h-8"}`}
      alt=""
      src={empty}
    />
    <p className="opacity-30 xs:text-sm text-center">{emptyText}</p>
  </div>
);

export default Empty;
