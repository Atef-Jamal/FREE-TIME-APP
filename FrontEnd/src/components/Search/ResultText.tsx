import { ISearchItem } from "../../types/othersTypes";

interface IProps {
  searchElement: ISearchItem;
  searchQuery: string;
}

const ResultText = ({ searchElement, searchQuery }: IProps) => {
  const slices = searchElement.title.split(new RegExp(`(${searchQuery})`, "gi"));
  return slices.map((slice, i) => {
    const isMatched = slice.toLocaleLowerCase() === searchQuery.toLocaleLowerCase();
    return (
      <span
        key={i}
        className={`${
          isMatched ? "bg-[#3d9eee71] text-[#58e634]" : "text-[#afaaaa]"
        } font-bold tracking-wider sm:text-sm`}
      >
        {slice}
      </span>
    );
  });
};

export default ResultText;
