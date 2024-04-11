import { Request, Response } from "express";
import Testimonial from "../models/testimonial";

export const getAllTestimonials = async (_: Request, res: Response) => {
  try {
    const allTestimonials = await Testimonial.find({}).populate(
      "user",
      "-password"
    );
    return res.status(200).json(allTestimonials);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "failed to get all testimonials" });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { content, stars }: { content: string; stars: number } = req.body;
  try {
    if (content.trim() === "") {
      return res
        .status(404)
        .json({ error: "server - please write your testimonial" });
    }
    const createOne = new Testimonial({
      user: currentUserId,
      content,
      stars,
    });

    const saved = await createOne.save();
    const testimonial = await saved.populate("user", "-password");
    return res.status(200).json(testimonial);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "failed to create testimonial" });
  }
};
