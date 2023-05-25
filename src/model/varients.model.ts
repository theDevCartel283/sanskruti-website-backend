import mongoose from "mongoose";
import { array } from "zod";

const varientSchema = new mongoose.Schema(
  {
    varientName: {
      type: String,
      required: true,
    },
    value: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const varientModel = mongoose.model("Varient", varientSchema);
export default varientModel;
