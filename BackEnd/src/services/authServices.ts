import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { io } from "../socketIo";
import PublicMessage from "../models/publicMessage";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { onLineUsers } from "../socketIo";
import Notification from "../models/notification";
import { userExcludedFields } from "../constants";
import User from "../models/user";

export const uploadImageToCloudinary = async (
  file: Express.Multer.File,
  userName: string,
  userId: string,
): Promise<UploadApiResponse> => {
  // 2. Convert the memory buffer to a Base64 Data URI
  const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  // 3. Upload directly to Cloudinary ONCE with your custom folder
  const result = await cloudinary.uploader.upload(fileBase64, {
    folder: "profileImages",
    allowed_formats: process.env.ALLOWED_FILE_TYPES!.split(","),
    public_id: `${userId}-${userName}-${Date.now()}`,
  });
  return result;
};

export const sendRewardToUser = async (referrerUser: string, currentNewUserId: string) => {
  const existedUser = await User.findById(referrerUser);
  if (!existedUser) throw new Error("Referrer user not found");

  const createNotification = new Notification({
    type: "REFERRER",
    belongsTo: referrerUser,
    metadata: {
      isCollected: false,
      referredUser: currentNewUserId,
      prize: 100,
    },
  });
  const saveNotification = await createNotification.save();
  const savedNotification = await saveNotification.populate("metadata.referredUser", userExcludedFields);
  const createPublicMessage = new PublicMessage({
    type: "FREETIME",
    typeOfTask: "REFERRER",
    sender: referrerUser,
    newUserReferred: currentNewUserId,
  });
  const saveMessage = await createPublicMessage.save();
  const savedMessage = await saveMessage.populate([
    { path: "sender", select: userExcludedFields },
    { path: "newUserReferred", select: userExcludedFields },
  ]);
  io.emit("public-message", savedMessage);
  io.to(onLineUsers[referrerUser.toString()]).emit("new-notification", savedNotification);
};

export const SignJwtToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY!);
};
export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string };
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
