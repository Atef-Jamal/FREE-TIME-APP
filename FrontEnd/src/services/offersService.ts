import { axiosRequest } from "../utilities";
import type { IFilterByDevice, IFilterByPopularity, IOfferReview, IOffer } from "../types";

export const fetchAllOffers = async ({
  filterByPopularity,
  filterByDevice,
  pageParam,
  limitPerPage,
}: {
  filterByPopularity: IFilterByPopularity | undefined;
  filterByDevice: IFilterByDevice | undefined;
  limitPerPage: number;
  pageParam: number;
}): Promise<{ offers: IOffer[]; hasMore: boolean }> => {
  const response = await axiosRequest.get(
    `api/offers?${filterByPopularity && `filterByPopularity=${filterByPopularity}`}&&${filterByDevice && `filterByDevice=${filterByDevice}`}&&pageParam=${pageParam}&&limitedPerPage=${limitPerPage}`,
  );
  const data = response.data;
  return data;
};

export const handleCreateOfferReview = async ({
  offerId,
  comment,
}: {
  offerId: string;
  comment: string;
}): Promise<IOfferReview> => {
  const response = await axiosRequest.post(`/api/offers/${offerId}/review`, {
    comment,
  });
  const review = response.data;
  return review;
};

export const fetchOfferDetails = async ({ offerId }: { offerId: string }): Promise<IOffer> => {
  const response = await axiosRequest.get(`api/offers/${offerId}`);
  const offer = response.data;
  return offer;
};
