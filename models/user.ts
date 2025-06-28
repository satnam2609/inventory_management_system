import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Email is required"],
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
});

const User=mongoose.models.User || mongoose.model("User",userSchema);

export default User;