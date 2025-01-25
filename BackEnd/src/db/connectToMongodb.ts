import mongoose from "mongoose";

export const connecteToMongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("success connected to MongoDB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
