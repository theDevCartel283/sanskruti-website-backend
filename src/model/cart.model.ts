import mongoose, { Schema } from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  product: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      variant: [
        {
          type: String,
        },
      ],
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const cartModel = mongoose.model("Cart", cartSchema);
export default cartModel;
