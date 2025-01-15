import { FcMusic } from "react-icons/fc";
import MusicCard from "../components/Music/MusicCard";
import Skeleton from "../components/Others/Skeleton";
import { useScrollToElement } from "../hooks";
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
    <div className="xs:p-3 p-6">
      <div className="mb-5 flex items-center gap-3 border-b pb-5 text-3xl text-[#73eb63]">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#dd40403b]">
          <FcMusic />
        </span>
        Musics
      </div>
      <div className="xs:grid-cols-2 grid grid-cols-8 gap-4 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6">
        {status === "pending" &&
          [...Array(21).keys()].map((i) => (
            <div
              key={i}
              className="flex h-[180px] flex-col items-center justify-between rounded-md border border-gray-700 bg-[#2a244481] p-3"
            >
              <Skeleton className="h-[60px] w-full rounded-full" />
              <Skeleton className="h-[18px] w-full" />
              <Skeleton className="h-[12px] w-full" />
              <Skeleton className="h-[28px] w-full" />
            </div>
          ))}

        {musics.map((song) => (
          <MusicCard key={song.id} songDetails={song} />
        ))}
      </div>
      {status === "error" && <div className="mx-auto my-8 text-center">an error occurred !</div>}
    </div>
  );
};

export default Musics;
