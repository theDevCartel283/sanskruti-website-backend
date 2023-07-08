import mongoose, { Schema, Document } from "mongoose";

interface ProductAttributes {
  name: string;
  images: string[];
  description: string;
  varients: {
    attributes: {
      name: string;
      state: boolean;
      childern: {
        value: string;
        state: boolean;
      }[];
    }[];
    variations: {
      quantity: number;
      discount: number;
      price: number;
      combinationString: string[];
    }[];
  };
  gst_percent: number;
  MainCategory: string;
  SubCategory: string;
  slug: string;
  brand_name: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  meta_tittle: string;
  meta_description: string;
  meta_keyword: string;
  createdBy: any;
}
export interface ProductDocument extends Document, ProductAttributes {
  created_at: Date;
  updated_at: Date;
}

const productSchema = new mongoose.Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        default: null,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    varients: {
      attributes: [],
      variations: [],
    },
    gst_percent: {
      type: Number,
      required: true,
      default: 0,
    },
    MainCategory: {
      type: String,
      required: true,
    },
    SubCategory: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    brand_name: {
      type: String,
      required: true,
    },
    is_featured: {
      type: Boolean,
      required: true,
    },
    is_new_arrival: {
      type: Boolean,
      required: true,
    },
    is_best_seller: {
      type: Boolean,
      required: true,
    },
    meta_tittle: {
      type: String,
      required: true,
    },
    meta_description: {
      type: String,
      required: true,
    },
    meta_keyword: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
