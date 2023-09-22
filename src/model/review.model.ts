import mongoose, { Schema } from "mongoose";

export interface Reviews {
  id: string;
  username: string;
  title: string;
  rating: number;
  comment: string;
  status: "Under review" | "Accepted";
}

export interface ProductRating extends Document {
  product_id: string;
  totalRatings: number;
  reviews: Reviews[];
  ratingCounts: {
    [key: number]: number;
  };
}

const reviewSchema = new Schema<ProductRating>({
  product_id: String,
  totalRatings: Number,
  reviews: [
    {
      id: String,
      username: String,
      title: String,
      rating: Number,
      comment: String,
      status: String,
    },
  ],
  ratingCounts: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
  },
});

const reviewModel = mongoose.model("Reviews", reviewSchema);
export default reviewModel;
