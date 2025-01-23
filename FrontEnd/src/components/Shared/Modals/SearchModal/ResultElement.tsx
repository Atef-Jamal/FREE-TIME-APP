import { Link } from "react-router-dom";
import { MdOutlineWeb } from "react-icons/md";
import ResultText from "./ResultText";
import { ISearchItem } from "../../../../types/othersTypes";
import { resetModel } from "../../../../context/StateManeger";
import { useAppDispatch } from "../../../../context/Hooks";

interface IProps {
  results: ISearchItem[];
  searchTerm: string;
  type: "FRAMES" | "APPS" | "USERS" | "FEATURES" | "MUSICS";
}

const ResultElement = ({ type, results, searchTerm }: IProps) => {
  const dispatch = useAppDispatch();
  return (
    <div>
      {results.map((item) => (
        <div key={item._id} className="flex items-center gap-3 px-2 py-1">
          {type === "FEATURES" && <MdOutlineWeb className="text-4xl sm:text-3xl" />}
          {type === "FRAMES" && (
            <div className="relative h-7 w-7 object-fill lg:h-10 lg:w-10">
              <span className="absolute z-[1] h-[65%] w-[55%] translate-x-[40%] translate-y-[30%] bg-[#19181b]"></span>
              <img alt={""} src={item.image} className="h-full w-full object-contain" />
            </div>
          )}
          {type === "APPS" && (
            <img
              alt={""}
              src={`${import.meta.env.VITE_SERVER_BASE_URL}/${item.image}`}
              className="h-7 w-7 rounded-full object-fill lg:h-10 lg:w-10"
            />
          )}
          {type === "MUSICS" && (
            <img alt={""} src={item.image} className="h-7 w-7 rounded-full object-fill lg:h-10 lg:w-10" />
          )}
          {type === "USERS" && (
            <img alt={""} src={item.image} className="h-7 w-7 rounded-full object-fill lg:h-10 lg:w-10" />
          )}
          <Link to={item.link} onClick={() => dispatch(resetModel())} className="underline">
            <ResultText searchElement={item} searchQuery={searchTerm} />
          </Link>
          {type === "USERS" && (
            <Link
              to={`/privatechat?chat-with=${item._id}`}
              onClick={() => dispatch(resetModel())}
              className="ml-auto rounded-lg bg-[#484b26] px-2 text-sm"
            >
              chat with
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResultElement;
