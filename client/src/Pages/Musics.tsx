import { MusicCard } from "../components";
import { FcMusic } from "react-icons/fc";
import { useAppSelector } from "../context/Hooks";

const Musics = () => {
  const { songs } = useAppSelector((state) => state.stateManeger);

  return (
    <div className="p-6 xs:p-3">
      <div className="flex items-center gap-3 text-3xl border-b text-[#73eb63] pb-5 mb-5">
        <span className="w-8 h-8 rounded-md bg-[#dd40403b] flex items-center justify-center">
          <FcMusic />
        </span>
        Musics
      </div>
      <div className="grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-4 xs:grid-cols-2 gap-4">
        {songs.length > 0 &&
          songs.map((song: any) => (
            <MusicCard key={song.id} songDetails={song} />
          ))}
      </div>
    </div>
  );
};

export default Musics;
