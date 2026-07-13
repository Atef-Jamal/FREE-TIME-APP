import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { userExcludedFields } from "../constants/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
  sendEmail,
  setTokenCookies,
  verifyRefreshToken,
} from "../services/authServices.js";
import { sendRewardToUser } from "../services/userServices.js";
import { io } from "../app.js";
import { uploadImageToCloudinary } from "../services/others.js";
import { redisClient } from "../lib/redis.js";
import { generateNewWeekRewards } from "../utils/index.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import PublicMessage from "../models/publicMessage.js";
import { Types } from "mongoose";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;
  const referrerUser = req.query.referrerUser as string;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(404).json({ error: "all field required" });
  }

  try {
    const userExisted = await User.findOne({ email });
    if (userExisted) {
      return res.status(404).json({ error: "User already existed, Try Log in" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dailyReward: generateNewWeekRewards(),
    });

    if (req.file) {
      const result = await uploadImageToCloudinary(req.file, newUser.name, newUser._id.toString());
      newUser.profilePicture = result.secure_url;
    }

    const savedUser = (await newUser.save()).toObject({
      transform: (_, ret: Record<string, any>) => {
        delete ret.password;
        delete ret.emailVerificationCode;
        delete ret.email;
        return ret;
      },
    });

    if (referrerUser) {
      await sendRewardToUser(new Types.ObjectId(referrerUser), savedUser._id);
    }

    const accessToken = generateAccessToken({ userId: savedUser._id });
    const refreshToken = generateRefreshToken({ userId: savedUser._id });

    setTokenCookies({ accessToken, refreshToken, res });

    return res.status(201).json({ status: "success" });
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred, Try again Later" });
  }
};

export const login = async (req: Request, res: Response) => {
  const {
    email,
    //  password
  } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User Not Found" });

    if (!user.password) {
      if (user.googleId) return res.status(404).json({ error: "Try to Login with google" });
      if (user.githubId) return res.status(404).json({ error: "Try to Login with github" });
      return res.status(404).json({ error: "Try to Login with social providers" });
    }

    // const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // if (!isPasswordCorrect) {
    //   return res.status(404).json({ error: "Invalid Password" });
    // }

    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    setTokenCookies({ accessToken, refreshToken, res });

    return res.status(200).json({ status: "success" });
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred, Try again later" });
  }
};

export const signInWithProvider = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const accessToken = generateAccessToken({ userId: req.user._id });
  const refreshToken = generateRefreshToken({ userId: req.user._id });
  setTokenCookies({ accessToken, refreshToken, res });
  return res.redirect(`${process.env.CLIENT_BASE_URL!}?provider-authenticated=true`);
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const getRefreshToken = req.cookies.refreshToken;
    if (!getRefreshToken) return res.status(401).json({ error: "No refresh token" });

    const decoded: any = verifyRefreshToken(getRefreshToken);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(403).json({ error: "Invalid session, user not found" });

    const newAccessToken = generateAccessToken({ userId: user._id });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1 * 60 * 1000,
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

export const logOut = async (_req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  try {
    const currentUser = await User.findById(req.user._id)
      .select("-password")
      .populate([{ path: "myFrames" }, { path: "activeFrame" }]);

    if (!currentUser) return res.status(404).json({ error: "User Not found" });

    return res.status(200).json(currentUser);
  } catch (error) {
    return res.status(404).json({ error: "can't load current user data" });
  }
};

export const sendEmailVerificationCode = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });

  try {
    const isVerifiedBefore = req.user.emailVerified;

    if (isVerifiedBefore) {
      return res.status(404).json({ error: "Sorry, Email Already Verified" });
    }

    const generateCode = Math.floor(Math.random() * 9000) + 1000;

    await User.findByIdAndUpdate(req.user._id, {
      emailVerificationCode: {
        code: generateCode.toString(),
        date: new Date(),
      },
    });

    await sendEmail({
      to: req.user.email,
      subject: "Verify Your Email Adress",
      text: `Verification code : ${generateCode}`,
    });

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(404).json({ error: "Failed to send verification code, an error occurred" });
  }
};

export const verifyEmailCode = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const enteredCode = req.body.enteredCode;
  try {
    const isVerifiedBefore = req.user.emailVerified;
    if (isVerifiedBefore) {
      return res.status(404).json({ error: "Sorry, Email Already Verified" });
    }

    const storedCode = req.user.emailVerificationCode.code;

    if (enteredCode !== storedCode) {
      return res.status(404).json({ error: "Incorrect verification code" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        emailVerified: true,
      },
      { returnDocument: "after" },
    )
      .select(userExcludedFields)
      .populate("activeFrame")
      .lean();

    if (!updatedUser) return res.status(401).json({ error: "an error occurred" });

    const newNotification = await Notification.create({
      type: "EMAIL-VERIFIED",
      belongsTo: req.user._id,
      metadata: {
        isCollected: false,
        prize: 100,
      },
    });

    await redisClient.del(`notifications:list:${req.user._id.toString()}`);

    const newPublicMessage = await PublicMessage.create({
      sender: req.user._id,
      typeOfTask: "EMAIL-VERIFIED",
      type: "FREETIME",
    });

    const populatedMessage = await PublicMessage.findById(newPublicMessage._id)
      .populate("sender", userExcludedFields)
      .lean();

    if (populatedMessage) io.emit("public_chat_message", populatedMessage);
    io.emit("user_updated", updatedUser);
    return res.status(200).json(newNotification);
  } catch (error) {
    return res.status(404).json({
      message: "Can't verify your email, an error occurred",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { enterdOldPass, newPass } = req.body;
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    const oldPassword = user.password;

    if (!oldPassword) return res.status(404).json({ error: "you logged in with Oauth provider!" });

    const isCorrect = await bcrypt.compare(enterdOldPass, oldPassword);

    if (!isCorrect) {
      return res.status(404).json({ error: "Old Password is not correct" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    await User.findByIdAndUpdate(req.user._id, {
      password: hashedPassword,
    });

    return res.status(200).json({ message: "Password changed successfullty" });
  } catch (error) {
    return res.status(404).json({ error: "Can't change password, an error occurred" });
  }
};

export const changeName = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "User authentication missing" });
  const { newName } = req.body;
  try {
    if (newName.trim() === "") {
      return res.status(404).json({ error: "please Enter Name" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: newName,
      },
      { returnDocument: "after" },
    )
      .select(userExcludedFields)
      .populate("activeFrame");

    if (!updatedUser) return res.status(401).json({ error: "an error occurred" });
    io.emit("user_updated", updatedUser);
    return res.status(200).json({ name: updatedUser.name });
  } catch (error) {
    return res.status(404).json({ error: "Can't change name, an error occurred" });
  }
};
