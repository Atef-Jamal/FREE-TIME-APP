import { ISearchItem } from "../../types/othersTypes";
import Empty from "../Others/Empty";
import { Link } from "react-router-dom";
import ResultText from "./ResultText";
import { resetModel } from "../../context/StateManeger";
import { useAppDispatch } from "../../context/Hooks";
import { MdOutlineWeb } from "react-icons/md";

interface IProps {
  results: ISearchItem[];
  searchTerm: string;
  emptyText: string;
  type: "FRAMES" | "APPS" | "USERS" | "FEATURES" | "MUSICS";
}

const ResultElement = ({ type, results, searchTerm, emptyText }: IProps) => {
  const dispatch = useAppDispatch();
  return (
    <div>
      {results.length === 0 && <Empty emptyText={emptyText} imgWidthHeight="w-10 h-10 xs:w-6 xs:h-6" />}
      {results.map((item) => (
        <div key={item._id} className="flex items-center gap-3 px-2 py-1">
          {type === "FEATURES" && <MdOutlineWeb className="text-4xl sm:text-3xl" />}
          {type === "FRAMES" && (
            <div className="relative h-10 w-10 object-fill sm:h-7 sm:w-7">
              <span className="absolute z-[1] h-[65%] w-[55%] translate-x-[40%] translate-y-[30%] bg-[#19181b]"></span>
              <img alt={""} src={item.image} className="h-full w-full object-contain" />
            </div>
          )}
          {type === "APPS" && (
            <img
              alt={""}
              src={`${import.meta.env.VITE_SERVER_BASE_URL}/${item.image}`}
              className="h-10 w-10 rounded-full object-fill sm:h-7 sm:w-7"
            />
          )}
          {type === "MUSICS" && (
            <img alt={""} src={item.image} className="h-10 w-10 rounded-full object-fill sm:h-7 sm:w-7" />
          )}
          {type === "USERS" && (
            <img alt={""} src={item.image} className="h-10 w-10 rounded-full object-fill sm:h-7 sm:w-7" />
          )}
          <Link to={item.link} onClick={() => dispatch(resetModel())} className="underline">
            <ResultText searchElement={item} searchQuery={searchTerm} />
          </Link>
          {type === "USERS" && (
            <Link
              to={`/privatechat?chat-with=${item._id}`}
              onClick={() => dispatch(resetModel())}
              className="ml-auto rounded-lg bg-[#484b26] px-2 sm:text-sm"
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
