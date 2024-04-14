import { lazy, useEffect } from "react";
import { FcMusic } from "react-icons/fc";
import { useAppDispatch, useAppSelector } from "../context/Hooks";
import { setAllMusics, showPopup } from "../context/StateManeger";
const MusicCard = lazy(() => import("../components/Music/MusicCard"));
const Skeleton = lazy(() => import("../components/Others/Skeleton"));

const Musics = () => {
  const { currentUserIsFetched, allMusics } = useAppSelector(
    (state) => state.stateManeger
  );
  // const [allMusics, setAllMusics] = useState([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fechSongs = async () => {
      const url =
        "https://deezerdevs-deezer.p.rapidapi.com/search?q=amr%20diab";
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "ea97c9aa5amsh33c80843d253d57p13e60ejsn31e5ff47a85c",
          "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setAllMusics(result.data);
      } catch (error) {
        dispatch(showPopup({ status: true, message: "Failed to Load Songs" }));
        console.error(error);
      }
    };

    fechSongs();
  }, []);

  return (
    <div className="p-6 xs:p-3">
      <div className="flex items-center gap-3 text-3xl border-b text-[#73eb63] pb-5 mb-5">
        <span className="w-8 h-8 rounded-md bg-[#dd40403b] flex items-center justify-center">
          <FcMusic />
        </span>
        Musics
      </div>
      <div className="grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-4 xs:grid-cols-2 gap-4">
        {allMusics.length > 0 &&
          currentUserIsFetched &&
          allMusics.map((song: any) => (
            <MusicCard key={song.id} songDetails={song} />
          ))}
        {allMusics.length === 0 ||
          (!currentUserIsFetched &&
            [...Array(21).keys()].map((i) => (
              <div
                key={i}
                className="h-[180px] p-3 rounded-md flex flex-col items-center justify-between bg-[#2a244481] border border-gray-700"
              >
                <Skeleton className="h-[60px] w-full rounded-full" />

                <Skeleton className="w-full h-[18px]" />

                <div className="w-full flex flex-col items-center gap-1">
                  <Skeleton className="h-[12px] w-full" />
                </div>

                <Skeleton className="w-full h-[28px]" />
              </div>
            )))}
      </div>
    </div>
  );
};

export default Musics;
