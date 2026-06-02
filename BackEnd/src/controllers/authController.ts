import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import PublicMessage from "../models/publicMessage";
import { onLineUsers } from "../socketIo";
import Notification from "../models/notification";
import { userExcludedFields } from "../constants";
import {
  generateAccessToken,
  generateRefreshToken,
  sendEmail,
  setTokenCookies,
  verifyRefreshToken,
} from "../services/authServices";
import { sendRewardToUser } from "../services/userServices";
import { io } from "../app";
import { uploadImageToCloudinary } from "../services/others";
import { redisClient } from "../lib/redis";

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
    });

    if (req.file) {
      const result = await uploadImageToCloudinary(req.file, newUser.name, newUser.id);
      newUser.profilePicture = result.secure_url;
    }

    const savedUser = await newUser.save();

    if (referrerUser) {
      await sendRewardToUser(referrerUser, savedUser.id);
    }

    const accessToken = generateAccessToken({ userId: savedUser.id });
    const refreshToken = generateRefreshToken({ userId: savedUser.id });

    setTokenCookies({ accessToken, refreshToken, res });

    return res.status(201).json({ status: "success" });
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred, Try again Later" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (!user.password) return res.status(404).json({ error: "try Login with social providers" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(404).json({ error: "Invalid Password" });
    }

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    setTokenCookies({ accessToken, refreshToken, res });

    return res.status(200).json({ status: "success" });
  } catch (error) {
    return res.status(404).json({ error: "an Error occurred, Try again later" });
  }
};

export const signInWithProvider = async (req: Request, res: Response) => {
  const accessToken = generateAccessToken({ userId: req.user.id });
  const refreshToken = generateRefreshToken({ userId: req.user.id });
  setTokenCookies({ accessToken, refreshToken, res });
  return res.redirect(`${process.env.CLIENT_BASE_URL!}?provider-authenticated=true`);
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyRefreshToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(403).json({ message: "Invalid session" });

    const newAccessToken = generateAccessToken({ userId: user.id });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

export const logOut = async (_req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findById(req.user?._id).select("-password").populate("myFrames");
    if (!currentUser) {
      return res.status(404).json({ error: "User Not found" });
    }
    return res.status(200).json(currentUser);
  } catch (error) {
    return res.status(404).json({ error: "An unexpected behaviour occurred" });
  }
};

export const sendEmailVerificationCode = async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "server - user not found" });
    }

    const isVerifiedBefore = user.emailVerified;

    if (isVerifiedBefore) {
      return res.status(404).json({ error: "Sorry, Email Already Verified" });
    }

    const generateCode = Math.floor(Math.random() * 9000) + 1000;

    user.emailVerificationCode = {
      code: generateCode.toString(),
      date: new Date(),
    };

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email Adress",
      text: `Verification code : ${generateCode}`,
    });

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(404).json({
      error: "Failed to send verification code, an error occurred",
    });
  }
};

export const verifyEmailCode = async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;
  const enteredCode = req.body.enteredCode;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const isVerifiedBefore = user.emailVerified;

    if (isVerifiedBefore) {
      return res.status(404).json({ error: "Sorry, Email Already Verified" });
    }

    const storedCode = user.emailVerificationCode?.code.toString();

    if (enteredCode.toString() !== storedCode) {
      return res.status(404).json({ error: "Incorrect verification code" });
    }
    user.emailVerified = true;
    const savedUser = await user.save();

    const createNotification = new Notification({
      type: "EMAIL-VERIFIED",
      belongsTo: currentUserId,
      metadata: {
        isCollected: false,
        prize: 100,
      },
    });
    const savedNotification = await createNotification.save();
    await redisClient.del(`notifications:list:${currentUserId}`);
    const createPublicMessage = new PublicMessage({
      sender: currentUserId,
      typeOfTask: "EMAIL-VERIFIED",
      type: "FREETIME",
    });
    const savePublicMessage = await createPublicMessage.save();
    const populatedMessage = await savePublicMessage.populate("sender", userExcludedFields);

    io.to(onLineUsers[currentUserId]).emit("new-notification", savedNotification);
    io.emit("public-message", populatedMessage);
    io.emit("user-updated", savedUser);

    return res.status(200).json({ message: "successfully verified" });
  } catch (error) {
    return res.status(404).json({
      message: "Can't verify your email, an error occurred",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const { enterdOldPass, newPass } = req.body;
  try {
    const user = await User.findById(currentUserId);

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

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfullty" });
  } catch (error) {
    return res.status(404).json({ error: "Can't change password, an error occurred" });
  }
};

export const changeName = async (req: Request, res: Response) => {
  const currentUserId = req.user?._id;
  const { newName } = req.body;
  try {
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ error: "Can't change name because user not found" });
    }
    if (newName === "" || typeof newName !== "string") {
      return res.status(404).json({ error: "please Enter Name" });
    }
    user.name = newName;
    const savedUser = await user.save();
    return res.status(200).json({ name: savedUser.name });
  } catch (error) {
    return res.status(404).json({ error: "Can't change name, an error occurred" });
  }
};
