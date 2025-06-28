import mongoose, { Schema } from "mongoose";

const invoiceSchema: Schema = new Schema(
  {
    items: [
      {
        product:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Item"
        },
        qty:Number
      }
    ],

    grandTotal: {
      type: Number,
      default: 0,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customer: {
      type: String,
    },
    order: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
