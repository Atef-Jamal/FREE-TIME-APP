import { axiosRequest } from "../../../lib/axios";
import { fetchMusics } from "../../musics/services";
import { IMusicDetail } from "../../musics/types";
import { ISearchResults } from "../types";

export const getSearchResults = async ({ searchTerm }: { searchTerm: string }): Promise<ISearchResults> => {
  const musics = await fetchMusics();
  const res = musics?.filter((item: IMusicDetail) => item.title.toLocaleLowerCase().includes(searchTerm));
  const mappedMusics = res?.map((item: IMusicDetail) => ({
    _id: item.id.toString(),
    description: item.title,
    image: item.album.cover,
    title: item.title,
    link: `/musics?to=${item.id.toString()}`,
  }));
  const response = await axiosRequest.get(`api/search?q=${searchTerm}`);
  const results = {
    ...response.data,
    musics: mappedMusics || [],
  };
  return results;
};
