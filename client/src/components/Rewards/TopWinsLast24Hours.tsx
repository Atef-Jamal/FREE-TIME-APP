interface TypeProps {
  name: string;
  money: string;
  color: string;
}

const TopWinsLast24Hours = ({ name, money, color }: TypeProps) => {
  return (
    <div
      className={`flex min-w-[31%] min-h-[40px] relative gap-3 justify-center border   ${
        color === "one" ? "bg-amber-400" : "bg-[#d63838be] "
      } items-center rounded-md`}
    >
      <span className="w-5 h-5 bg-[#242438] rounded-md border-2 text-[10px] text-center text-white pt-[0.8px]">
        {name[0].toUpperCase()}
      </span>
      <span className="text-black text-xs">{name}</span>
      <span className="absolute top-[-5px] right-[20%] w-12 h-3 rounded-sm bg-[#723333] text-yellow-300 text-[9px] flex items-center justify-center">
        {money}
      </span>
    </div>
  );
};

export default TopWinsLast24Hours;
