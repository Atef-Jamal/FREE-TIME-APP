import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const upload = multer({ storage });

const generateNewWeekRewards = (startDay?: Date) => {
  const newWeekRewards = [...Array(7).keys()].map((item) => {
    if (startDay) {
      return {
        day: item + 1,
        availableAt: new Date(
          new Date(new Date().setHours(0, 0, 0, 0)).setDate(startDay.getDate() + item + 1),
        ),
        isCollected: false,
        reward: 50 * (item + 1),
      };
    } else {
      return {
        day: item + 1,
        availableAt: new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() + item)),
        isCollected: false,
        reward: 50 * (item + 1),
      };
    }
  });

  return newWeekRewards;
};

export { cloudinary, upload, generateNewWeekRewards };
