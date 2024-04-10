import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      email: string;
      password: string;
      user?: any;
    }
  }
}

const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorizedddd" });
    }

    const decoded: any = jwt.verify(
      token,
      "a8908f02766c63417f00659f49549eaff1e043e87b7f84c5abac96c142c9896a"
    );

    if (!decoded) {
      return res.status(404).json({ error: "unauthorized - invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "server - user not found" });
    }

    req.user = user;

    return next();
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "internal server error ttttttt" });
  }
};

export default protectedRoute;
