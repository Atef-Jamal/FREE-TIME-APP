import { Request, Response } from "express";
import User from "../models/user.js";
import Offer from "../models/offer.js";
import { features } from "../data/data.js";
import Frame from "../models/frame.js";

export const searchController = async (req: Request, res: Response) => {
  const searchTerm = req.query.q as string;
  try {
    if (searchTerm.trim() === "") return res.status(404).json({ error: "Enter search term" });

    const regex = new RegExp(searchTerm, "gi");

    const getFeatures = features
      .filter((item) => item.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
      .slice(0, 12);

    const getUsersPromise = User.find({
      name: regex,
    })
      .sort({ points: -1, createdAt: -1 })
      .limit(12)
      .select("_id name profilePicture");

    const getOffersPromise = Offer.find({ title: regex }).limit(12);
    const getFramesPromise = Frame.find({ title: regex }).limit(12);

    const [users, offers, frames] = await Promise.all([getUsersPromise, getOffersPromise, getFramesPromise]);

    const usersResult = users.map((user) => ({
      _id: user._id,
      description: "",
      title: user.name,
      image: user.profilePicture,
      link: `/user/${user._id}`,
    }));

    const offersResults = offers.map((app) => ({
      _id: app._id,
      description: app.description,
      title: app.title,
      image: app.image,
      link: `/earn?to=${app._id}`,
    }));

    const framesResults = frames.map((frame) => ({
      _id: frame._id,
      description: frame.description,
      title: frame.title,
      image: frame.image,
      link: `/marketplace?to=${frame._id}`,
    }));

    return res.status(200).json({
      features: getFeatures,
      users: usersResult,
      offers: offersResults,
      frames: framesResults,
    });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred!" });
  }
};
