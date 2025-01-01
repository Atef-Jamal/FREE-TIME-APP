import { TypeSearchItem } from "../../types/othersTypes";

interface TypeProps {
  searchElement: TypeSearchItem;
  searchQuery: string;
}

const ResultText = ({ searchElement, searchQuery }: TypeProps) => {
  const slices = searchElement.title.split(new RegExp(`(${searchQuery})`, "gi"));
  return slices.map((slice, i) => {
    const isMatched = slice.toLocaleLowerCase() === searchQuery.toLocaleLowerCase();
    return (
      <span
        key={i}
        className={`${
          isMatched ? "bg-[#3d9eee71] text-[#58e634]" : "text-[#afaaaa]"
        } sm:text-sm font-bold tracking-wider`}
      >
        {slice}
      </span>
    );
  });
};

export default ResultText;
