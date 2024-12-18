import { FcMusic } from "react-icons/fc";
import MusicCard from "../components/Music/MusicCard";
import Skeleton from "../components/Others/Skeleton";
import { useScrollToElement } from "../hooks/commonHooks";
import { useQuery } from "@tanstack/react-query";
import { fetchMusics } from "../utils";

const Musics = () => {
  const { data: musics = [], status } = useQuery({
    queryKey: ["musics"],
    queryFn: fetchMusics,
    staleTime: 60 * 60 * 1000,
  });

  useScrollToElement({ dependencies: [musics] });

  return (
    <div className="p-6 xs:p-3">
      <div className="flex items-center gap-3 text-3xl border-b text-[#73eb63] pb-5 mb-5">
        <span className="w-8 h-8 rounded-md bg-[#dd40403b] flex items-center justify-center">
          <FcMusic />
        </span>
        Musics
      </div>
      <div className="grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-4 xs:grid-cols-2 gap-4">
        {status === "pending" &&
          [...Array(21).keys()].map((i) => (
            <div
              key={i}
              className="h-[180px] p-3 rounded-md flex flex-col items-center justify-between bg-[#2a244481] border border-gray-700"
            >
              <Skeleton className="h-[60px] w-full rounded-full" />
              <Skeleton className="w-full h-[18px]" />
              <Skeleton className="h-[12px] w-full" />
              <Skeleton className="w-full h-[28px]" />
            </div>
          ))}

        {musics.map((song) => (
          <MusicCard key={song.id} songDetails={song} />
        ))}
      </div>
      {status === "error" && (
        <div className="text-center mx-auto my-8">an error occurred !</div>
      )}
    </div>
  );
};

export default Musics;
