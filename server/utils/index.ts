import { Response } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
// comment
export const validation = (
  values: string[],
  signIn: boolean,
  agreePrivacy?: boolean
) => {
  let result = `Must Be Exist-`;
  values.map((item, index) => {
    let name;
    if (index === 0) name = `${signIn ? "Email" : "Username"} `;
    if (index === 1) name = `${signIn ? "Password" : "Email"} `;
    if (index === 2) name = `Password `;
    if (index === 3) name = `Confirm Password `;
    return item.trim() === "" ? (result += name) : undefined;
  });
  if (values.every((item) => item.trim() !== "") && values[2] !== values[3])
    return (result = `Password doesn't Match`);
  if (values[0].length < 3 && !signIn)
    return (result = `name must be at least 3 character`);
  if (values[0].length > 17 && !signIn)
    return (result = `name must be less than 17 character`);
  if (!signIn) {
    if (!agreePrivacy && values.every((item) => item.trim() !== "")) {
      return (result = `must agree Privacy Policy and terms of service`);
    }
  }
  if (values.every((item) => item.trim() !== "")) {
    return (result = "");
  }
  return result.split("-").reverse().join("");
};

export const generateTokenAndSetCookies = (
  userId: { userId: mongoose.Types.ObjectId },
  res: Response
) => {
  // userId.
  const token = jwt.sign(
    { userId },
    "9a83dd41dd075bdc1f7cbd9cb66790bff33e58618886c73210a4e1e5490241f2"
  );
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
};
