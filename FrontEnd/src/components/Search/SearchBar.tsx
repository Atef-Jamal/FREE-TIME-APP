import { BiSearch } from "react-icons/bi";

interface IProps {
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  hideInput?: boolean;
}

const SearchBar = ({ placeholder, onChange, readOnly = false }: IProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md border border-gray-700 bg-[#333030]">
      <span className={`flex h-full min-w-[50px] items-center justify-center lg:min-w-[60px]`}>
        <BiSearch className={`${readOnly ? "text-2xl lg:text-3xl" : "text-lg lg:text-xl"} opacity-70`} />
      </span>

      <input
        type="text"
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className="h-full w-full truncate border-l border-gray-500 bg-[#1f1f22] px-2 text-sm text-[#6cb4f8] outline-none placeholder:text-[#8b6868] md:px-4 md:text-base"
      />
    </div>
  );
};

export default SearchBar;
