import { Response, Request } from "express";

export const getDate = async (_: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return res.status(200).json(today);
  } catch (error) {
    return res.status(404).json({ error: "an error occured" });
  }
};
