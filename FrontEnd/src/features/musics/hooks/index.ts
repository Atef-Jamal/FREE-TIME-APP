import { useQuery } from "@tanstack/react-query";
import { fetchMusics } from "../services";

export const useFetchMusics = () => {
  return useQuery({
    queryKey: ["musics"],
    queryFn: fetchMusics,
  });
};
