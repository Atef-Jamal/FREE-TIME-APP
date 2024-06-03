import { useEffect, useState } from "react";
import { handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";
import { CgClose } from "react-icons/cg";
import { resetModel } from "../../context/StateManeger";
import { useAppDispatch } from "../../context/Hooks";
import { TypeSearchResults } from "../../types/othersTypes";
import SearchSkeleton from "./SearchSkeleton";
import ResultEelement from "./resultEelement";

const Search = () => {
  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState<TypeSearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  let resultsCounts = 0;

  if (results) {
    resultsCounts =
      results.features.length +
      results.users.length +
      results.apps.length +
      results.frames.length;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    if (searchTerm.trim() === "") {
      if (results !== null) setResults(null);
      return;
    }
    setSearchQ(searchTerm);
  };

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

  useEffect(() => {
    if (!searchQ) return;
    const timout = setTimeout(() => {
      getResults();
    }, 500);

    return () => clearTimeout(timout);
  }, [searchQ]);

  return (
    <div className="border border-gray-600 w-[800px] sm:w-[80%] xs:w-[95%] max-h-[90%] sm:max-h-[79%] overflow-auto absolute top-20 sm:top-[57px] translate-x-[-50%]  bg-[#19181b] rounded-lg">
      <div className="sticky top-0 p-2  bg-[#362b53] flex">
        <div className="w-full border border-gray-700 rounded-md">
          <input
            type="text"
            onChange={handleChange}
            autoFocus
            placeholder="Search For EveryThing"
            className="outline-none rounded-md bg-[#2c2626] placeholder:opacity-30 sm:placeholder:text-xs text-[#7893ec] sm:text-sm text-lg py-2 px-4 sm:px-2 w-full"
          />
        </div>
        <button
          onClick={() => dispatch(resetModel())}
          className="w-10 h-11 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center ml-1"
        >
          <CgClose className="text-2xl sm:text-lg" />
        </button>
      </div>
      <div className="border-gray-600">
        {loading && <SearchSkeleton />}

        {!results && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="text-center text-gray-500 font-bold">
              Start Searching
            </div>
          </div>
        )}

        {!loading && results && (
          <div className="p-2">
            <p className="text-sm xs:text-[10px] text-gray-400 mb-1">
              <span className="text-sm xs:text-[10px] text-[#8be64e] mx-1 ">
                {resultsCounts}
              </span>
              Results Found
            </p>

            <h1 className="text-gray-500 font-bold text-center border border-gray-700 mb-1">
              Feartures
            </h1>
            <ResultEelement
              type="FEATURES"
              results={results.features}
              searchTerm={searchQ}
              emptyText={"No Features Found"}
            />

            <h1 className="text-gray-500 font-bold text-center border border-gray-700 my-1">
              People
            </h1>
            <ResultEelement
              type="USERS"
              results={results.users}
              searchTerm={searchQ}
              emptyText={"No People Found"}
            />

            <h1 className="text-gray-500 font-bold text-center border border-gray-700 my-1">
              Apps
            </h1>
            <ResultEelement
              type="APPS"
              results={results.apps}
              searchTerm={searchQ}
              emptyText={"No offers, apps Found"}
            />

            <h1 className="text-gray-500 font-bold text-center border border-gray-700 my-1">
              Frames
            </h1>
            <ResultEelement
              type="FRAMES"
              results={results.frames}
              searchTerm={searchQ}
              emptyText={"No Frames Found"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
