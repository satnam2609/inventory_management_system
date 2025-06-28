import mongoose from "mongoose";

export default async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected!");
  } catch (error) {
    console.log("Database connection failed with error:", error);
  }
}
