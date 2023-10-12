import mongoose, { Schema } from "mongoose";

export interface Reviews {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  username: string;
  title: string;
  rating: number;
  comment: string;
  status: "Under review" | "Accepted" | "Denied";
  notify: boolean;
}
export interface ReviewDocument extends Reviews, Document {}

export interface ProductRating {
  product_id: string;
  totalRatings: number;
  ratingCounts: {
    [key: number]: number;
  };
}
export interface ProductRatingDocument extends ProductRating, Document {}

const reviewSchema = new Schema<ReviewDocument>({
  id: String,
  product_id: String,
  product_name: String,
  product_image: String,
  username: String,
  title: String,
  rating: Number,
  comment: String,
  status: String,
  notify: Boolean,
});

export const reviewModel = mongoose.model("Reviews", reviewSchema);

const productRatingSchema = new Schema<ProductRatingDocument>({
  product_id: String,
  totalRatings: Number,
  ratingCounts: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
  },
});

export const productRatingModel = mongoose.model("Rating", productRatingSchema);
