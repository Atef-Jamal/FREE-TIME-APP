import mongoose from "mongoose";

export const connecteToMongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("sucess connected to MongoDB");
  } catch (error) {
    throw new Error("Failed to connect to DB");
  }
};
