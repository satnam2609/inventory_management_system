import mongoose from "mongoose";

export default async function connectDb() {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    if (connect) {
      console.log("Database connected");
    }
  } catch (error) {
    console.log("Dataase error", error);
  }
}
