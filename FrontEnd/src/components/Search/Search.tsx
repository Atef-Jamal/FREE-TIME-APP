import { useEffect, useState } from "react";
import ResultItem from "./ResultItem";
import { empty } from "../../assets";
import Spinner from "../Others/Spinner";
import { Link } from "react-router-dom";
import { handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";

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
    <div className="border border-gray-500 w-[700px] sm:w-[90%] max-h-[90%]  overflow-auto absolute top-20 sm:top-14 translate-x-[-50%]  bg-[#191624]">
      <div className="sticky top-0 p-4 sm:p-2 bg-[#241d38]">
        <div className=" border border-gray-600 rounded-lg">
          <input
            type="text"
            onChange={handleChange}
            placeholder="search for Features, users, tasks and apps, anything"
            className="outline-none rounded-md bg-[#1a0808e3] placeholder:text-gray-600 sm:placeholder:text-xs text-[#7893ec] sm:text-sm text-lg  font-bold p-2 sm:p-1 w-full"
          />
        </div>
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
            <h1 className="text-gray-400 font-bold text-center border border-gray-700 mb-3">
              Feartures
            </h1>
            {results.features.length === 0 && (
              <div className="flex items-center justify-center gap-3 py-2">
                <img
                  alt=""
                  src={empty}
                  className="w-9 h-9 sm:w-6 sm:h-6 object-contain"
                />
                <div className="text-center text-gray-500 sm:text-sm">
                  No Results Founded
                </div>
              </div>
            )}
            {results.features.map((item) => {
              return (
                <div
                  key={item._id}
                  className="py-1 px-2 flex items-center justify-between"
                >
                  <Link to={item.link} className="underline">
                    <ResultItem searchElement={item} searchQuery={searchQ} />
                  </Link>
                </div>
              );
            })}
            <h1 className="text-gray-400 font-bold text-center border border-gray-700 mb-3 mt-2">
              Users
            </h1>
            {results.users.length === 0 && (
              <div className="flex items-center justify-center gap-3 py-2">
                <img
                  alt=""
                  src={empty}
                  className="w-9 h-9 sm:w-6 sm:h-6 object-contain"
                />
                <div className="text-center text-gray-500 sm:text-sm">
                  No Results Founded
                </div>
              </div>
            )}
            {results.users.map((item) => {
              return (
                <div
                  key={item._id}
                  className="py-1 px-2 flex items-center gap-2"
                >
                  <img
                    alt=""
                    src={`${import.meta.env.VITE_BASE_URL}/${item.image}`}
                    className="w-7 h-7 sm:w-5 sm:h-5 object-contain rounded-full"
                  />
                  <Link to={item.link} className="underline">
                    <ResultItem searchElement={item} searchQuery={searchQ} />
                  </Link>
                </div>
              );
            })}
            <h1 className="text-gray-400 font-bold text-center border border-gray-700 mb-3 mt-2">
              Apps
            </h1>
            {results.apps.length === 0 && (
              <div className="flex items-center justify-center gap-3 py-2">
                <img
                  alt=""
                  src={empty}
                  className="w-9 h-9 sm:w-6 sm:h-6 object-contain"
                />
                <div className="text-center text-gray-500 sm:text-sm">
                  No Results Founded
                </div>
              </div>
            )}
            {results.apps.map((item) => {
              return (
                <div
                  key={item._id}
                  className="py-1 px-2 flex items-center justify-between"
                >
                  <Link to={item.link} className="underline">
                    <ResultItem searchElement={item} searchQuery={searchQ} />
                  </Link>
                </div>
              );
            })}
            <h1 className="text-gray-400 font-bold text-center border border-gray-700 mb-3 mt-2">
              Frames
            </h1>
            {results.frames.length === 0 && (
              <div className="flex items-center justify-center gap-3 py-2">
                <img
                  alt=""
                  src={empty}
                  className="w-9 h-9 sm:w-6 sm:h-6 object-contain"
                />
                <div className="text-center text-gray-500 sm:text-sm">
                  No Results Founded
                </div>
              </div>
            )}
            {results.frames.map((item) => {
              return (
                <div
                  key={item._id}
                  className="py-1 px-2 flex items-center justify-between"
                >
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
