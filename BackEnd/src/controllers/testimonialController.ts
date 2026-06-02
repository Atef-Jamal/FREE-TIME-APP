import { Request, Response } from "express";
import Testimonial from "../models/testimonial";
import { userExcludedFields } from "../constants";
import { redisClient } from "../lib/redis";

export const getAllTestimonials = async (_req: Request, res: Response) => {
  try {
    const cacheKey = "testimonials:list";
    const cachedTestimonials = await redisClient.get(cacheKey);

    if (cachedTestimonials) {
      return res.status(200).json(JSON.parse(cachedTestimonials));
    }
    const allTestimonials = await Testimonial.find({}).populate("user", userExcludedFields);
    await redisClient.set(cacheKey, JSON.stringify(allTestimonials));
    return res.status(200).json(allTestimonials);
  } catch (error) {
    return res.status(404).json({ error: "Failed to Load all testimonials" });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  const currentUserId = req.user._id;
  const { content, stars } = req.body;
  try {
    const newTestimonial = new Testimonial({
      user: currentUserId,
      content,
      stars,
    });
    const saved = await newTestimonial.save();
    const testimonial = await saved.populate("user", userExcludedFields);
    await redisClient.del("testimonials:list");
    return res.status(200).json(testimonial);
  } catch (error) {
    return res.status(404).json({ error: "Failed to create testimonial" });
  }
};
