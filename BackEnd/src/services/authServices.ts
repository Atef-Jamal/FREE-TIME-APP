import { Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer/index.js";
import dotenv from "dotenv";
import { Types } from "mongoose";

dotenv.config();

export const setTokenCookies = ({
  accessToken,
  refreshToken,
  res,
}: {
  accessToken: string;
  refreshToken: string;
  res: Response;
}) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",

    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const generateAccessToken = ({ userId }: { userId: Types.ObjectId }) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY!, { expiresIn: "15m" });
};

export const generateRefreshToken = ({ userId }: { userId: Types.ObjectId }) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET_KEY!, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY!);
};

export const sendEmail = async ({ to, subject, text }: { to: string; subject: string; text: string }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER_EMAIL,
      pass: process.env.NODEMAILER_USER_PASSWORD,
    },
  });

  const options: Mail.Options = {
    from: process.env.NODEMAILER_USER_EMAIL,
    to,
    subject,
    text,
  };

  await transporter.sendMail(options);
};
