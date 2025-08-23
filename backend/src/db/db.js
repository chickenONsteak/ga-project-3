import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("DB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};