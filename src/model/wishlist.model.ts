import mongoose, { Schema } from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  products: [{ type: Schema.Types.ObjectId, required: true }],
});

const wishlistModel = mongoose.model("Wishlist", wishlistSchema);
export default wishlistModel;
