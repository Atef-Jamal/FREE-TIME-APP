interface IProps {
  name: string;
  money: string;
  color: string;
}

const TopWinsLast24Hours = ({ name, money, color }: IProps) => {
  return (
    <div
      className={`relative flex min-h-[40px] min-w-[31%] justify-center gap-3 border ${
        color === "one" ? "bg-amber-400" : "bg-[#d63838be]"
      } items-center rounded-md`}
    >
      <span className="h-5 w-5 rounded-md border-2 bg-[#242438] pt-[0.8px] text-center text-[10px] text-white">
        {name[0].toUpperCase()}
      </span>
      <span className="text-xs text-black">{name}</span>
      <span className="absolute right-[20%] top-[-5px] flex h-3 w-12 items-center justify-center rounded-sm bg-[#723333] text-[9px] text-yellow-300">
        {money}
      </span>
    </div>
  );
};

export default TopWinsLast24Hours;
