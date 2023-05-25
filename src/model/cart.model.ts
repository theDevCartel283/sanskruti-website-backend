import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  product: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      gst_price: {
        type: Number,
        default: 0,
      },
      sale_price: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const cartModel = mongoose.model("Cart", cartSchema);
export default cartModel;
