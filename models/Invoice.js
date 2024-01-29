import mongoose, { Schema, models } from "mongoose";

const invoiceSchema = Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          required: [true, "Product is required"],
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: [true, "Category is required"],
        },
      },
    ],
    type: {
      type: Boolean,
      default: false,
    },
    grandTotal: {
      type: Number,
      required: [true, "Grand total is required"],
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requried: [true, "Required"],
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
