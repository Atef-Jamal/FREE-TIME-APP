import { axiosRequest } from "../../../lib/axios";
import { ITestimonial } from "../types";

export const fetchTestimonials = async (): Promise<ITestimonial[]> => {
  const response = await axiosRequest.get("api/testimonials");
  const testimonials = response.data.reverse();
  return testimonials;
};

export const handleSendTestimonial = async ({
  comment,
  stars,
}: {
  comment: string;
  stars: number;
}): Promise<ITestimonial> => {
  const response = await axiosRequest.post("api/testimonials", {
    content: comment,
    stars,
  });
  const newTestimonial = response.data;
  return newTestimonial;
};
