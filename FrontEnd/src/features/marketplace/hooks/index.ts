import { useQuery } from "@tanstack/react-query";
import { fetchAllFrames } from "../services";

export const useFetchFrames = () => {
  return useQuery({
    queryKey: ["frames"],
    queryFn: fetchAllFrames,
  });
};
