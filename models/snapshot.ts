import mongoose, { Schema } from "mongoose";

const snapshotSchema = new Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    soldPrice: {
      type: Number,
      default: 0,
    },
    soldAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Snapshot =
  mongoose.models.Snapshot || mongoose.model("Snapshot", snapshotSchema);

export default Snapshot;
