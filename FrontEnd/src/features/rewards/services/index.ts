import { axiosRequest } from "../../../lib/axios";
import { IBounusCode, IDailyReward } from "../types";

export const claimDailyReward = async (
  day: number,
): Promise<{ points: number; dailyReward: IDailyReward[]; week: number }> => {
  const response = await axiosRequest.post(`api/rewards/daily-reward/collect`, { day });
  return response.data;
};

export const fetchBonusCode = async (): Promise<IBounusCode> => {
  const respons = await axiosRequest.get("api/coupons");
  return respons.data;
};

export const applyBonusCode = async ({ code }: { code: string }): Promise<{ points: number }> => {
  const response = await axiosRequest.post("api/coupons", {
    code,
  });
  const updatedPoints = response.data;
  return updatedPoints;
};
