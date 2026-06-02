import type { IMusicDetail } from "../types";
import { axiosRequest } from "../utilities";

export const purshaseMusic = async ({
  musicId,
  musicTitle,
}: {
  musicId: string;
  musicTitle: string;
}): Promise<{ points: number; musicId: string }> => {
  const response = await axiosRequest.post(`api/musics/buy-music/${musicId}`, { musicTitle });
  const data = response.data;
  return data;
};

export const fetchMusics = async (): Promise<IMusicDetail[]> => {
  const response = await axiosRequest.get("api/musics");
  return response.data;
};
