import { axiosRequest } from "../lib/axios";
import type { IBuyFrameNotify, IFrame } from "../types";

export const fetchAllFrames = async (): Promise<IFrame[]> => {
  const response = await axiosRequest.get("api/frames");
  const frames = response.data;
  return frames;
};

export const purshaseFrame = async ({
  frameId,
}: {
  frameId: string;
}): Promise<{ points: number; frame: IFrame; notification: IBuyFrameNotify }> => {
  const response = await axiosRequest.get(`api/frames/${frameId}`);
  const data = response.data;
  return data;
};
