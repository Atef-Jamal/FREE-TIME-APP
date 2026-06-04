import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/userModel.js";
import { verifyAccessToken } from "../services/authServices.js";

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface User extends IUser {}
  }
}

const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded: any = verifyAccessToken(token);

    const userData = await User.findById(decoded.userId).select("-password");

    if (!userData) return res.status(404).json({ error: "User Not Found" });

    req.user = userData;

    return next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }
    return res.status(500).json({ error: "authentication error" });
  }
};

export default protectedRoute;
