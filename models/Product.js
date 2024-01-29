import mongoose, { Schema, models } from "mongoose";

const productSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a valid name for the product"],
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    price: {
      type: String,
      default: "0",
    },
    count: {
      type: Number,
      default: 0,
    },
    minCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || mongoose.model("Product", productSchema);

export default Product;
