import { useAppSelector } from "../../context/hooks";
import { useScrollToElement } from "../../hooks/useScrollToElement";
import MusicCard from "../../components/Ui/MusicCard";
import Empty from "../../components/Shared/Common/Empty";
import { useFetchMusics } from "../../tanstackQuery/queryFetch";
import { selectCurrentUser } from "../../context/appStateSlice";

const MyMusics = () => {
  const currentUser = useAppSelector(selectCurrentUser);

  const { data: musics = [], status } = useFetchMusics();

  useScrollToElement({ startScroll: status === "success" });

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
