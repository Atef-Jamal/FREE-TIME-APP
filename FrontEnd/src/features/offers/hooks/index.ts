import { skipToken, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { IFilterByDevice, IFilterByPopularity } from "../types";
import { fetchAllOffers, fetchOfferDetails } from "../services";

export const useInfiniteOffers = ({
  filterByDevice,
  filterByPopularity,
  limitPerPage,
}: {
  filterByDevice: IFilterByDevice;
  filterByPopularity: IFilterByPopularity;
  limitPerPage: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["offers", filterByDevice, filterByPopularity, limitPerPage],
    queryFn: ({ pageParam }) =>
      fetchAllOffers({
        filterByDevice,
        filterByPopularity,
        limitPerPage,
        pageParam,
      }),

    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });
};

export const useFetchOfferDetails = ({ offerId }: { offerId: string | undefined }) => {
  return useQuery({
    queryKey: ["offers", offerId],
    queryFn: offerId ? () => fetchOfferDetails({ offerId }) : skipToken,
  });
};
