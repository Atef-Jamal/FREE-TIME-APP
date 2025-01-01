import { useRef, useState } from "react";
import { getSearchResults } from "../../utils";
import { CgClose } from "react-icons/cg";
import { resetModel } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import SearchSkeleton from "./SearchSkeleton";
import ResultElement from "./ResultElement";
import { empty } from "../../assets";
import { skipToken, useQuery } from "@tanstack/react-query";
import { debounce } from "../../utils/common";

const Search = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const [searchQ, setSearchQ] = useState("");
  const timeOutRef = useRef(null);
  const dispatch = useAppDispatch();

  const {
    data: results,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["search", searchQ],
    queryFn: searchQ ? () => getSearchResults({ searchQ }) : skipToken,
    staleTime: 60 * 60 * 1000,
  });

  let resultsCounts = 0;

  if (results) {
    resultsCounts =
      results.features.length +
      results.users.length +
      results.apps.length +
      results.frames.length +
      results.musics.length;
  }

  const handleSetSearchQuery = (value: string) => {
    setSearchQ(value);
  };

  const debounced = debounce(handleSetSearchQuery, 500, timeOutRef);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.replace(/\s+/g, " ").trim().toLocaleLowerCase();
    debounced(searchTerm);
  };

  return (
    <div className="border border-gray-600 w-[800px] sm:w-[80%] xs:w-[95%] max-h-[90%] sm:max-h-[79%] overflow-auto sm:scrollbar-thin absolute top-20 sm:top-[57px] translate-x-[-50%]  bg-[#19181b] rounded-lg">
      <div className="sticky z-[100] top-0 p-2  bg-[#362b53] flex">
        <div className="w-full border border-gray-700 rounded-md">
          <input
            type="text"
            onChange={handleChange}
            autoFocus
            placeholder="Search For EveryThing"
            className="outline-none rounded-md bg-[#2c2626] placeholder:opacity-40 sm:placeholder:text-base text-[#7893ec] sm:text-base text-lg py-2 px-4 sm:px-2 w-full"
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
        {error && (
          <>
            <p className="text-lg sm:text-base text-[#bd672e] text-center py-4">
              {error.response?.data.error}
            </p>
            <div className="flex mb-4">
              <button
                onClick={() => refetch()}
                className="text-sm font-bold bg-[#51a549] text-[#1c1f2c] text-center py-1 px-4 rounded-md mx-auto"
              >
                Try Again
              </button>
            </div>
          </>
        )}
        {isFetching && <SearchSkeleton />}

        {!results && !isFetching && !error && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="text-center text-gray-500 font-bold">Start Searching</div>
          </div>
        )}

        {results && (
          <div className="p-2">
            <p className="sm:text-sm text-gray-400 mb-1">
              <span className="sm:text-sm  text-[#8be64e] mx-1 ">{resultsCounts}</span>
              Results Found
            </p>

            {resultsCounts === 0 && (
              <div className="my-10 flex flex-col items-center justify-center gap-4">
                <img src={empty} className="w-16 h-16 sm:w-12 sm:h-12 object-cover" />
                <p className="font-bold sm:font-medium text-center text-[#bbb9b9]">
                  No Results Match your search text
                </p>
              </div>
            )}

            {results.features.length > 0 && (
              <>
                <h1 className="bg-[#504040] text-[#74b7d1] font-bold text-center border border-gray-700 mb-1">
                  Feartures
                </h1>
                <ResultElement
                  type="FEATURES"
                  results={results.features}
                  searchTerm={searchQ}
                  emptyText={"No Features Found"}
                />
              </>
            )}

            {results.users.length > 0 && (
              <>
                <h1 className="bg-[#504040] text-[#74b7d1]  font-bold text-center border border-gray-700 my-1">
                  People
                </h1>
                <ResultElement
                  type="USERS"
                  results={results.users.filter((usr) => usr._id !== currentUser?._id)}
                  searchTerm={searchQ}
                  emptyText={"No People Found"}
                />
              </>
            )}

            {results.apps.length > 0 && (
              <>
                <h1 className="bg-[#504040] text-[#74b7d1]  font-bold text-center border border-gray-700 my-1">
                  Apps
                </h1>
                <ResultElement
                  type="APPS"
                  results={results.apps}
                  searchTerm={searchQ}
                  emptyText={"No offers, apps Found"}
                />
              </>
            )}

            {results.frames.length > 0 && (
              <>
                <h1 className="bg-[#504040] text-[#74b7d1]  font-bold text-center border border-gray-700 my-1">
                  Frames
                </h1>
                <ResultElement
                  type="FRAMES"
                  results={results.frames}
                  searchTerm={searchQ}
                  emptyText={"No Frames Found"}
                />
              </>
            )}
            {results.musics.length > 0 && (
              <>
                <h1 className="bg-[#504040] text-[#74b7d1]  font-bold text-center border border-gray-700 my-1">
                  Musics
                </h1>
                <ResultElement
                  type="MUSICS"
                  results={results.musics}
                  searchTerm={searchQ}
                  emptyText={"No Musics Found"}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
