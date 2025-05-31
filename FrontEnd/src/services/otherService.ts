import { IMusicDetail, ISearchResults, ITestimonial } from "../types/othersTypes";
import { axiosRequest } from "../utilities";
import { fetchMusics } from "./musicService";

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

export const fetchTestimonials = async (): Promise<ITestimonial[]> => {
  const response = await axiosRequest.get("api/testimonials");
  const testimonials = response.data.reverse();
  return testimonials;
};

export const handleSendTestimonial = async ({
  comment,
  stars,
}: {
  comment: string;
  stars: number;
}): Promise<ITestimonial> => {
  const response = await axiosRequest.post("api/testimonials", {
    content: comment,
    stars,
  });
  const newTestimonial = response.data;
  return newTestimonial;
};
