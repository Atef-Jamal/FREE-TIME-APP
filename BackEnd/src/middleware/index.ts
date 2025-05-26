/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";

declare module "express" {
  interface Request {
    currentUser?: IUser | any;
    user?: IUser | any;
  }
}

const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "UnAuthorized Request, Log in with your credientials" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    if (!decoded) {
      return res.status(404).json({ error: "UnAuthorized, Invalid credientials" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    req.currentUser = user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error, log in with your credentials" });
  }
};

export default protectedRoute;
