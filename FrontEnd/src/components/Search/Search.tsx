import { useEffect, useState } from "react";
import ResultItem from "./ResultItem";
import Spinner from "../Others/Spinner";
import { Link } from "react-router-dom";
import { handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";
import { CgClose } from "react-icons/cg";
import { resetModel } from "../../context/StateManeger";
import { useAppDispatch } from "../../context/Hooks";
import { FcRedo } from "react-icons/fc";
import Empty from "../Others/Empty";

export interface TypeSearchItem {
  _id: string;
  title: string;
  link: string;
  description: string;
  image: string;
}

export interface TypeSearchResults {
  features: TypeSearchItem[];
  users: TypeSearchItem[];
  apps: TypeSearchItem[];
  frames: TypeSearchItem[];
}

const Search = () => {
  //   const example = {
  //     features: [
  //       {
  //         _id: "feature1",
  //         title: "how can i get bonus code",
  //         description: "how can i get bonus code description",
  //         image: "",
  //         link: "/rewards",
  //       },
  //       {
  //         _id: "feature2",
  //         title: "my refferal link",
  //         description: "my refferal link description",
  //         image: "",
  //         link: "/myprofile",
  //       },
  //     ],
  //     apps: [
  //       {
  //         _id: "app1",
  //         title: "pubge app",
  //         description: "pubge app description",
  //         image: "",
  //         link: "/earn",
  //       },
  //       {
  //         _id: "app2",
  //         title: "fortinite app",
  //         description: "fortinite app description",
  //         image: "",
  //         link: "/earn",
  //       },
  //     ],
  //     users: [
  //       {
  //         _id: "user1",
  //         title: "atef gamal",
  //         description: "user description",
  //         image: "",
  //         link: "/user/1",
  //       },
  //       {
  //         _id: "user2",
  //         title: "ali ahmed",
  //         description: "user description",
  //         image: "",
  //         link: "/user/2",
  //       },
  //     ],
  //   };

  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState<TypeSearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    if (searchTerm.trim() === "") {
      setResults(null);
      return;
    }
    setSearchQ(searchTerm);
  };

  useEffect(() => {
    if (!searchQ) return;

    const getResults = async () => {
      if (error) setError(null);
      if (!loading) setLoading(true);

      try {
        const response = await makeRequest.get(`api/search?q=${searchQ}`);
        setResults(response.data);
      } catch (error) {
        setError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };

    const timout = setTimeout(() => {
      getResults();
    }, 500);

    return () => clearTimeout(timout);
  }, [searchQ]);

  return (
    <div className="border border-gray-600 w-[700px] sm:w-[90%] max-h-[90%] sm:max-h-[81%]  overflow-auto absolute top-20 sm:top-11 translate-x-[-50%]  bg-[#19181b] rounded-lg">
      <div className="sticky top-0 p-2  bg-[#29223d] flex">
        <div className="w-full border border-gray-600 rounded-lg">
          <input
            type="text"
            onChange={handleChange}
            placeholder="search for Features, users, tasks and apps, anything"
            className="outline-none rounded-md bg-[#1a0808e3] placeholder:text-gray-600 sm:placeholder:text-xs text-[#7893ec] sm:text-sm text-lg  font-bold p-2 sm:p-1 w-full"
          />
        </div>
        <button
          onClick={() => dispatch(resetModel())}
          className="w-10 h-11 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center"
        >
          <CgClose className="text-2xl sm:text-lg" />
        </button>
      </div>
      <div className="border-gray-600">
        {loading && (
          <div className="w-full py-10">
            <Spinner className="w-10 h-10 sm:w-6 sm:h-6 mx-auto border-b-yellow-500 border-l-yellow-500" />
          </div>
        )}
        {!results && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="text-center text-gray-500 font-bold">
              Start Searching
            </div>
          </div>
        )}
        {!loading && results && (
          <div className="p-2">
            <h1 className="text-gray-500 font-bold text-center border border-gray-700 mb-3">
              Feartures
            </h1>
            {results.features.length === 0 && (
              <Empty
                emptyText="No Features Founded"
                imgWidthHeight="xs:w-6 xs:h-6"
              />
            )}
            {results.features.map((item) => {
              return (
                <div
                  key={item._id}
                  className="py-1 px-2 flex items-center gap-2"
                >
                  <span className="w-6 h-6 rounded-lg">
                    <FcRedo className="text-xl" />
                  </span>
                  <Link to={item.link} className="underline">
                    <ResultItem searchElement={item} searchQuery={searchQ} />
                  </Link>
                </div>
              );
            })}
            <h1 className="text-gray-500 font-bold text-center border border-gray-700 mb-3 mt-2">
              People
            </h1>
            {results.users.length === 0 && (
              <Empty
                emptyText="No People Founded"
                imgWidthHeight="xs:w-6 xs:h-6"
              />
            )}
            {results.users.map((item) => {
              return (
                <div
                  key={item._id}
                  className="py-1 px-2 flex items-center gap-2"
                >
                  <img
                    alt=""
                    src={`${import.meta.env.VITE_SERVER_BASE_URL}/${
                      item.image
                    }`}
                    className="w-7 h-7 sm:w-5 sm:h-5 object-contain rounded-full"
                  />
                  <Link to={item.link} className="underline">
                    <ResultItem searchElement={item} searchQuery={searchQ} />
                  </Link>
                </div>
              );
            })}
            <h1 className="text-gray-500 font-bold text-center border border-gray-700 mb-3 mt-2">
              Apps
            </h1>
            {results.apps.length === 0 && (
              <Empty
                emptyText="No Apps Founded"
                imgWidthHeight="xs:w-6 xs:h-6"
              />
            )}
            {results.apps.map((item) => {
              return (
                <div
                  key={item._id}
                  className="py-1 px-2 flex items-center gap-2"
                >
                  <img
                    alt=""
                    src={`${import.meta.env.VITE_SERVER_BASE_URL}/${
                      item.image
                    }`}
                    className="w-7 h-7 sm:w-5 sm:h-5 object-contain rounded-full"
                  />
                  <Link to={item.link} className="underline">
                    <ResultItem searchElement={item} searchQuery={searchQ} />
                  </Link>
                </div>
              );
            })}
            <h1 className="text-gray-500 font-bold text-center border border-gray-700 mb-3 mt-2">
              Frames
            </h1>
            {results.frames.length === 0 && (
              <Empty
                emptyText="No Frames Founded"
                imgWidthHeight="xs:w-6 xs:h-6"
              />
            )}
            {results.frames.map((item) => {
              return (
                <div
                  key={item._id}
                  className="py-1 px-2 flex items-center justify-between"
                >
                  <div className="relative w-7 h-7 sm:w-5 sm:h-5">
                    <span className=" w-[55%] h-[65%] absolute z-[1] translate-x-[40%] translate-y-[30%] bg-[#353052]"></span>
                    <img
                      alt=""
                      src={item.image}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Link to={item.link} className="underline">
                    <ResultItem searchElement={item} searchQuery={searchQ} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
