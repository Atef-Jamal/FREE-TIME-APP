import type { IFrame } from "../types";
import { axiosRequest } from "../utilities";

export const fetchAllFrames = async (): Promise<IFrame[]> => {
  const response = await axiosRequest.get("api/frames");
  const frames = response.data;
  return frames;
};

export const purshaseFrame = async ({
  frameId,
}: {
  frameId: string;
}): Promise<{ points: number; savedFrame: IFrame }> => {
  const response = await axiosRequest.get(`api/frames/${frameId}`);
  const data = response.data;
  return data;
};
