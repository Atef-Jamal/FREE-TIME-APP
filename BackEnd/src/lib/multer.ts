import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const storage = multer.memoryStorage();

export const uploadCloud = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE!) },
});
