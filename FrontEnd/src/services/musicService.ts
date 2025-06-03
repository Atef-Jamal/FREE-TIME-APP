import type { IMusicDetail } from "../types";
import { axiosRequest } from "../utilities";

export const purshaseMusic = async ({
  musicId,
  musicTitle,
}: {
  musicId: string;
  musicTitle: string;
}): Promise<{ points: number; musicId: string }> => {
  const response = await axiosRequest.post(`api/songs/buy-song/${musicId}`, { musicTitle });
  const data = response.data;
  return data;
};

export const fetchMusics = async (): Promise<IMusicDetail[]> => {
  const url = import.meta.env.VITE_DEEZER_MUSICS_URL;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": import.meta.env.VITE_X_RAPIDAPI_KEY,
      "X-RapidAPI-Host": import.meta.env.VITE_X_RAPIDAPI_HOST,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();
  const musics = data.data;
  return musics;
};
