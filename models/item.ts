import mongoose, { Schema } from "mongoose";

const itemSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a valid name for the product"],
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
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
    minCount: {
      type: Number,
      default: 0,
    },
    inventory: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.index({ slug: "text" });


const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default Item;
