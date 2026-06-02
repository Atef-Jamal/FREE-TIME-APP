import { UploadApiResponse } from "cloudinary";
import cloudinary from "../lib/cloudinary";

export const uploadImageToCloudinary = async (
  file: Express.Multer.File,
  userName: string,
  userId: string,
): Promise<UploadApiResponse> => {
  const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(fileBase64, {
    folder: "profileImages",
    allowed_formats: process.env.ALLOWED_FILE_TYPES!.split(","),
    public_id: `${userId}-${userName}-${Date.now()}`,
  });

  return result;
};
