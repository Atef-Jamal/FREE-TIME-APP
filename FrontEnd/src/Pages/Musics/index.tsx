import { FcMusic } from "react-icons/fc";
import { useScrollToElement } from "../../hooks/useScrollToElement";
import MusicCard from "../../components/Ui/MusicCard";
import Skeleton from "../../components/Shared/Common/Skeleton";
import { useFetchMusics } from "../../tanstackQuery/queryFetch";

const Musics = () => {
  const { data: musics = [], status } = useFetchMusics();

  useScrollToElement({ startScroll: status === "success" });

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-5 flex items-center gap-3 border-b pb-5 text-3xl text-[#73eb63]">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#dd40403b]">
          <FcMusic />
        </span>
        Musics
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6">
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
