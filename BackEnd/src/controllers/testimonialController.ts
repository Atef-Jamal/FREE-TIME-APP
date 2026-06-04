import { Request, Response } from "express";
import TestimonialModel from "../models/testimonialModel.js";
import { userExcludedFields } from "../constants/index.js";
import { redisClient } from "../lib/redis.js";

export const getAllTestimonials = async (_req: Request, res: Response) => {
  try {
    const cacheKey = "testimonials:list";

    const cachedTestimonials = await redisClient.get(cacheKey);

    if (cachedTestimonials) return res.status(200).json(JSON.parse(cachedTestimonials));

    const allTestimonials = await TestimonialModel.find({}).populate("user", userExcludedFields);

    await redisClient.set(cacheKey, JSON.stringify(allTestimonials));

    return res.status(200).json(allTestimonials);
  } catch (error) {
    return res.status(404).json({ error: "Failed to Load all testimonials" });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { content, stars } = req.body;
  try {
    const newTestimonials = await TestimonialModel.create({
      user: req.user._id,
      content,
      stars,
    });

    const populatedTestimonials = await TestimonialModel.findById(newTestimonials._id).populate(
      "user",
      userExcludedFields,
    );

    await redisClient.del("testimonials:list");
    return res.status(200).json(populatedTestimonials);
  } catch (error) {
    return res.status(404).json({ error: "Failed to create testimonial" });
  }
};
