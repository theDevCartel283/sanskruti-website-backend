import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Image: {
      type: String,
      required: false,
      default: null,
    },
    Meta_Title: {
      type: String,
      required: true,
    },
    Meta_Description: {
      type: String,
      required: true,
    },
    subCategory: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;
