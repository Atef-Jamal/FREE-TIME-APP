import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../context/Hooks";
import { fetchMusics } from "../../utils";
import { useScrollToElement } from "../../hooks";
import MusicCard from "../Musics/MusicCard";
import Empty from "../../components/Shared/Common/Empty";

const MyMusics = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const { data: musics = [] } = useQuery({
    queryKey: ["musics"],
    queryFn: fetchMusics,
    staleTime: 60 * 60 * 1000,
  });

  useScrollToElement({ dependencies: [musics] });

  return (
    <div id="my-musics" className="mt-5 flex w-full flex-col items-center gap-2 rounded-md bg-[#222339] p-2">
      <h1 className="text-center font-bold text-[#a0e965ee]">My Musics</h1>
      <div className="grid w-full grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:gap-2 xl:grid-cols-6">
        {musics
          ?.filter((item) => {
            if (currentUser?.mySongs?.includes(item.id.toString())) {
              return item;
            }
          })
          .map((element) => <MusicCard key={element.id} songDetails={element} />)}
      </div>
      {currentUser?.mySongs?.length === 0 && <Empty text="Empty Musics" />}
    </div>
  );
};

export default MyMusics;
