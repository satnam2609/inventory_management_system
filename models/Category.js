import mongoose, { models, Schema } from "mongoose";

const categorySchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [3, "Name is too short"],
      maxLength: [32, "Name is too long"],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || mongoose.model("Category", categorySchema);

export default Category;
