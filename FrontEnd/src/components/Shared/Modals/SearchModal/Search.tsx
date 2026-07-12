import { useState } from "react";
import { CgClose } from "react-icons/cg";
import { resetModel, selectCurrentUser } from "../../../../context/appStateSlice";
import { useAppDispatch, useAppSelector } from "../../../../context/hooks";
import SearchSkeleton from "./SearchSkeleton";
import ResultElement from "./ResultElement";
import { debounce } from "../../../../utilities";
import Empty from "../../Common/Empty";
import { useGetSearchResult } from "../../../../tanstackQuery/queryFetch";

const Search = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();

  const { data: results, error, refetch, isFetching } = useGetSearchResult({ searchTerm });

  let resultsCounts = 0;

  if (results) {
    resultsCounts =
      results.features.length +
      results.users.length +
      results.offers.length +
      results.frames.length +
      results.musics.length;
  }

  const handleSetSearchQuery = (value: string) => {
    setSearchTerm(value);
  };

  const debounced = debounce(handleSetSearchQuery, 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.replace(/\s+/g, " ").trim().toLocaleLowerCase();
    debounced(searchTerm);
  };

  return (
    <div className="scrollbar-custom mb-auto mt-10 max-h-[90%] w-[95%] overflow-y-auto rounded-md border border-gray-400 bg-[#19181b] md:w-[80%] lg:mt-14 lg:w-[70%] lg:max-w-[900px] lg:rounded-lg">
      <div className="sticky top-0 z-[1] flex items-center bg-[#362b53] p-2">
        <div className="w-full overflow-hidden rounded-sm border border-gray-700 md:rounded-md">
          <input
            type="text"
            onChange={handleChange}
            autoFocus
            placeholder="Search For EveryThing"
            className="w-full bg-[#2c2626] px-2 py-1 text-sm text-[#7893ec] outline-none placeholder:opacity-50 md:px-4 md:py-2 lg:text-base lg:placeholder:text-base"
          />
        </div>
        <button
          onClick={() => dispatch(resetModel())}
          className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg lg:h-11 lg:w-10"
        >
          <CgClose className="text-2xl" />
        </button>
      </div>
      <div className="border-gray-600">
        {error && (
          <>
            <p className="py-4 text-center text-base text-[#bd672e] lg:text-lg">
              {error.response?.data.error}
            </p>
            <div className="mb-4 flex">
              <button
                onClick={() => refetch()}
                className="mx-auto rounded-md bg-[#51a549] px-4 py-1 text-center text-sm font-bold text-[#1c1f2c]"
              >
                Try Again
              </button>
            </div>
          </>
        )}
        {isFetching && <SearchSkeleton />}

        {!results && !isFetching && !error && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="text-center font-bold text-gray-500">Start Searching</div>
          </div>
        )}

        {results && (
          <div className="p-2">
            <p className="mb-1 text-sm text-gray-400">
              <span className="mx-1 text-[#8be64e]">{resultsCounts}</span>
              Results Found
            </p>

            {resultsCounts === 0 && <Empty text=" no results match your search criteria" />}

            {results.features.length > 0 && (
              <>
                <h1 className="mb-1 border border-gray-700 bg-[#504040] text-center font-bold text-[#74b7d1]">
                  Feartures
                </h1>
                <ResultElement type="FEATURES" results={results.features} searchTerm={searchTerm} />
              </>
            )}

            {results.users.length > 0 && (
              <>
                <h1 className="my-1 border border-gray-700 bg-[#504040] text-center font-bold text-[#74b7d1]">
                  People
                </h1>
                <ResultElement
                  type="USERS"
                  results={results.users.filter((usr) => usr._id !== currentUser?._id)}
                  searchTerm={searchTerm}
                />
              </>
            )}

            {results.offers.length > 0 && (
              <>
                <h1 className="my-1 border border-gray-700 bg-[#504040] text-center font-bold text-[#74b7d1]">
                  Offers
                </h1>
                <ResultElement type="APPS" results={results.offers} searchTerm={searchTerm} />
              </>
            )}

            {results.frames.length > 0 && (
              <>
                <h1 className="my-1 border border-gray-700 bg-[#504040] text-center font-bold text-[#74b7d1]">
                  Frames
                </h1>
                <ResultElement type="FRAMES" results={results.frames} searchTerm={searchTerm} />
              </>
            )}
            {results.musics.length > 0 && (
              <>
                <h1 className="my-1 border border-gray-700 bg-[#504040] text-center font-bold text-[#74b7d1]">
                  Musics
                </h1>
                <ResultElement type="MUSICS" results={results.musics} searchTerm={searchTerm} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
