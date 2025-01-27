import { IMusicDetail, ISearchResults, ITestimonial } from "../types/othersTypes";
import { makeRequest } from "./config";
import { fetchMusics } from "./musicService";

export const getSearchResults = async ({ searchQ }: { searchQ: string }): Promise<ISearchResults> => {
  const musics = await fetchMusics();
  const res = musics?.filter((item: IMusicDetail) => item.title.toLocaleLowerCase().includes(searchQ));
  const mappedMusics = res?.map((item: IMusicDetail) => ({
    _id: item.id.toString(),
    description: item.title,
    image: item.album.cover,
    title: item.title,
    link: `/musics?to=${item.id.toString()}`,
  }));
  const response = await makeRequest.get(`api/search?q=${searchQ}`);
  const results = {
    ...response.data,
    musics: mappedMusics || [],
  };
  return results;
};

export const fetchTestimonials = async (): Promise<ITestimonial[]> => {
  const response = await makeRequest.get("api/testimonials");
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
  const response = await makeRequest.post("api/testimonials", {
    content: comment,
    stars,
  });
  const newTestimonial = response.data;
  return newTestimonial;
};
