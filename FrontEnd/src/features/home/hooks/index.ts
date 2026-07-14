import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials } from "../services";

export const useFetchTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });
};
