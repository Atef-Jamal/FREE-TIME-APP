import { QueryClient } from "@tanstack/react-query";
import { ITestimonial } from "../types";

export const addTestimonialCache = ({
  queryClient,
  newTestimonial,
}: {
  queryClient: QueryClient;
  newTestimonial: ITestimonial;
}) => {
  return queryClient.setQueryData(["testimonials"], (previousData: ITestimonial[]) => {
    return [newTestimonial, ...previousData];
  });
};
