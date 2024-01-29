import mongoose, { models, Schema } from "mongoose";

/**@description The user role model schema  */
/** The role can be admin,moderator and subscriber */

const userSchema = Schema({
  userName: {
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

const User = models.User || mongoose.model("User", userSchema);

export default User;
