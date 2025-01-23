import { empty } from "../../../assets";

const Empty = ({ text }: { text: string }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-3 p-2">
      <img src={empty} alt="Empty" className="h-10 w-10 object-contain opacity-50 lg:h-14 lg:w-14" />
      <p className="text-center text-sm font-bold tracking-wide text-[#685f5f] lg:text-base">{text}</p>
    </div>
  );
};

export default Empty;
