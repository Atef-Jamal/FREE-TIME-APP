import { BiSearch } from "react-icons/bi";

interface TypeSearchBar {
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  hideInput?: boolean;
}

const SearchBar = ({
  placeholder,
  onChange,
  readOnly = false,
}: TypeSearchBar) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#242424] border border-gray-700 rounded-md overflow-hidden">
      <span
        className={`min-w-[70px] lg:min-w-[60px] sm:min-w-[50px] h-full flex items-center justify-center`}
      >
        <BiSearch
          className={`${
            readOnly ? "text-3xl" : "text-xl sm:text-lg"
          } opacity-70`}
        />
      </span>

      <input
        type="text"
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className="truncate outline-none text-[#6cb4f8] border-gray-500 bg-[#383849] w-full h-full px-4 sm:px-2 border-l"
      />
    </div>
  );
};

export default SearchBar;
