import mongoose from "mongoose";

export const connecteToMongodb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://atefgmal778:rdhtVbts115SPov0@freetime.ul8fbwx.mongodb.net/freetimedb?retryWrites=true&w=majority"
    );
    console.log("sucess connected to MongoDB");
  } catch (error) {
    console.log("Failed to connect to MongoDB");
  }
};
