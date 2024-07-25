import { TypeSearchItem } from "../../types/othersTypes";
import Empty from "../Others/Empty";
import { Link } from "react-router-dom";
import ResultText from "./ResultText";
import { resetModel } from "../../context/StateManeger";
import { useAppDispatch } from "../../context/Hooks";
import { MdOutlineWeb } from "react-icons/md";

const ResultElement = ({
  type,
  results,
  searchTerm,
  emptyText,
}: {
  results: TypeSearchItem[];
  searchTerm: string;
  emptyText: string;
  type: "FRAMES" | "APPS" | "USERS" | "FEATURES";
}) => {
  const dispatch = useAppDispatch();
  return (
    <div>
      {results.length === 0 && (
        <Empty emptyText={emptyText} imgWidthHeight="w-10 h-10 xs:w-6 xs:h-6" />
      )}
      {results.map((item) => (
        <div key={item._id} className="py-1 px-2 flex items-center gap-3">
          {type === "FEATURES" && (
            <MdOutlineWeb className="text-4xl sm:text-3xl" />
          )}
          {type === "FRAMES" && (
            <div className="relative w-10 h-10 sm:w-7 sm:h-7 object-fill ">
              <span className=" w-[55%] h-[65%] absolute z-[1] translate-x-[40%] translate-y-[30%] bg-[#19181b]"></span>
              <img
                alt=""
                src={item.image}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          {type === "APPS" && (
            <img
              alt=""
              src={item.image}
              className="w-10 h-10 sm:w-7 sm:h-7 object-fill rounded-full "
            />
          )}
          {type === "USERS" && (
            <img
              alt=""
              src={item.image}
              className="w-10 h-10 sm:w-7 sm:h-7 object-fill rounded-full "
            />
          )}
          <Link
            to={item.link}
            onClick={() => dispatch(resetModel())}
            className="underline"
          >
            <ResultText searchElement={item} searchQuery={searchTerm} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ResultElement;
