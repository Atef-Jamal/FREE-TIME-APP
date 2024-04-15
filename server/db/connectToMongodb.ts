import mongoose from "mongoose";

export const connecteToMongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || "");
    console.log("sucess connected to MongoDB");
  } catch (error) {
    console.log("Failed to connect to MongoDB");
  }
};
