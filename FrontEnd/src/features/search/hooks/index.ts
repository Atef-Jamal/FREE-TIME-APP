import { skipToken, useQuery } from "@tanstack/react-query";
import { getSearchResults } from "../services";

export const useGetSearchResult = ({ searchTerm }: { searchTerm: string }) => {
  return useQuery({
    queryKey: ["search", searchTerm],
    queryFn: searchTerm ? () => getSearchResults({ searchTerm }) : skipToken,
  });
};
