import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../context/Hooks";
import MusicCard from "../Music/MusicCard";
import Empty from "../Others/Empty";
import { fetchMusics } from "../../utils";
import { useScrollToElement } from "../../hooks";

const MyMusics = () => {
  const currentUser = useAppSelector((state) => state.stateManeger.currentUser);
  const { data: musics = [] } = useQuery({
    queryKey: ["musics"],
    queryFn: fetchMusics,
    staleTime: 60 * 60 * 1000,
  });

  useScrollToElement({ dependencies: [musics] });

  return (
    <div id="my-musics" className=" w-full flex flex-col items-center gap-2 mt-5 bg-[#222339] p-2 rounded-md">
      <h1 className="text-[#a0e965ee] font-bold text-center ">My Musics</h1>
      <div className="w-full grid grid-cols-8 xl:grid-cols-6 lg:grid-cols-5 sm:grid-cols-4 xs:grid-cols-2 gap-2">
        {musics
          ?.filter((item) => {
            if (currentUser?.mySongs?.includes(item.id.toString())) {
              return item;
            }
          })
          .map((element) => <MusicCard key={element.id} songDetails={element} />)}
      </div>
      {currentUser?.mySongs?.length === 0 && <Empty emptyText="No Musics Buyed" />}
    </div>
  );
};

export default MyMusics;
