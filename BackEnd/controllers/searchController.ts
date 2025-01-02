import { Request, Response } from "express";
import User from "../models/user";
import Task from "../models/task";
import { features } from "../data/data";
import Frame from "../models/frame";

export const searchController = async (req: Request, res: Response) => {
  const searchTerm = req.query.q as string;
  try {
    if (!searchTerm) {
      return res.status(404).json({ error: "Enter search term" });
    }
    const regex = new RegExp(searchTerm, "gi");

    const getFeatures = features
      .filter((item) => item.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
      .slice(0, 12);

    const getUsers = await User.find({
      name: regex,
    })
      .sort({ points: -1, createdAt: -1 })
      .limit(12)
      .select("_id name profilePicture");
    const getApps = await Task.find({ title: regex }).limit(12);
    const getFrames = await Frame.find({ title: regex }).limit(12);

    const usersResult = getUsers.map((user) => ({
      _id: user._id,
      description: "",
      title: user.name,
      image: user.profilePicture,
      link: `/user/${user._id}`,
    }));

    const appsResults = getApps.map((app) => ({
      _id: app._id,
      description: app.description,
      title: app.title,
      image: app.image,
      link: `/earn?to=${app._id}`,
    }));

    const framesResults = getFrames.map((frame) => ({
      _id: frame._id,
      description: frame.description,
      title: frame.title,
      image: frame.image,
      link: `/marketplace?to=${frame._id}`,
    }));

    return res.status(200).json({
      features: getFeatures,
      users: usersResult,
      apps: appsResults,
      frames: framesResults,
    });
  } catch (error) {
    return res.status(404).json({ error: "an error occurred!" });
  }
};
