import { useEffect, useState } from "react";
import { handleApiError } from "../../utils/common";
import { makeRequest } from "../../utils";
import { CgClose } from "react-icons/cg";
import { resetModel } from "../../context/StateManeger";
import { useAppDispatch, useAppSelector } from "../../context/Hooks";
import { TypeSearchResults } from "../../types/othersTypes";
import SearchSkeleton from "./SearchSkeleton";
import ResultElement from "./ResultElement";

const Search = () => {
  const { currentUser } = useAppSelector((state) => state.stateManeger);
  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState<TypeSearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const deezerUrl = import.meta.env.VITE_DEEZER_MUSICS_URL;
  const musicOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": import.meta.env.VITE_X_RAPIDAPI_KEY,
      "X-RapidAPI-Host": import.meta.env.VITE_X_RAPIDAPI_HOST,
    },
  };

  let resultsCounts = 0;

  if (results) {
    resultsCounts =
      results.features.length +
      results.users.length +
      results.apps.length +
      results.frames.length +
      results.musics.length;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    if (searchTerm.trim() === "") {
      if (results !== null) setResults(null);
      return;
    }
    setSearchQ(searchTerm.toLocaleLowerCase());
  };

  const getResults = async () => {
    if (error) setError(null);
    if (!loading) setLoading(true);

    const musicResponse = await fetch(deezerUrl, musicOptions);
    const musics = await musicResponse.json();
    const res = musics?.data?.filter((item: any) =>
      item.title.toLocaleLowerCase().includes(searchQ)
    );
    const mappedMusics = res?.map((item: any) => ({
      _id: item.id.toString(),
      description: item.title,
      image: item.album.cover,
      title: item.title,
      link: `/musics?to=${item.id.toString()}`,
    }));

    try {
      const response = await makeRequest.get(`api/search?q=${searchQ}`);

      setResults({
        ...response.data,
        musics: mappedMusics || [],
      });
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
    <div className="border border-gray-600 w-[800px] sm:w-[80%] xs:w-[95%] max-h-[90%] sm:max-h-[79%] overflow-auto sm:scrollbar-thin absolute top-20 sm:top-[57px] translate-x-[-50%]  bg-[#19181b] rounded-lg">
      <div className="sticky z-[100] top-0 p-2  bg-[#362b53] flex">
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
            <ResultElement
              type="FEATURES"
              results={results.features}
              searchTerm={searchQ}
              emptyText={"No Features Found"}
            />

            <h1 className="text-gray-500 font-bold text-center border border-gray-700 my-1">
              People
            </h1>
            <ResultElement
              type="USERS"
              results={results.users.filter(
                (usr) => usr._id !== currentUser?._id
              )}
              searchTerm={searchQ}
              emptyText={"No People Found"}
            />

            <h1 className="text-gray-500 font-bold text-center border border-gray-700 my-1">
              Apps
            </h1>
            <ResultElement
              type="APPS"
              results={results.apps}
              searchTerm={searchQ}
              emptyText={"No offers, apps Found"}
            />

            <h1 className="text-gray-500 font-bold text-center border border-gray-700 my-1">
              Frames
            </h1>
            <ResultElement
              type="FRAMES"
              results={results.frames}
              searchTerm={searchQ}
              emptyText={"No Frames Found"}
            />
            <h1 className="text-gray-500 font-bold text-center border border-gray-700 my-1">
              Musics
            </h1>
            <ResultElement
              type="MUSICS"
              results={results.musics}
              searchTerm={searchQ}
              emptyText={"No Musics Found"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
