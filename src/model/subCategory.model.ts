import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    Slug: {
      type: String,
      required: true,
    },
    Meta_Title: {
      type: String,
      required: true,
    },
    Meta_Description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const subCategoryModel = mongoose.model("subCategory", subCategorySchema);
export default subCategoryModel;
