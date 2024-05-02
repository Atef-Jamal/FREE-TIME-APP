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
      return res
        .status(401)
        .json({ error: "unauthorized Request, Log in with your credientials" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY || "");

    if (!decoded) {
      return res
        .status(404)
        .json({ error: "unauthorized Request, Invalid credientials" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error, unexpected behaviour occurred" });
  }
};

export default protectedRoute;
