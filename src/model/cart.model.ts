import mongoose, { Document, Schema } from "mongoose";
import { Types } from "mongoose";

export type CartItem = {
  productId: Types.ObjectId;
  quantity: number;
  variant: string[];
};

export interface CartDocument extends Document {
  userId: Types.ObjectId;
  product: CartItem[];
}

const cartSchema: Schema<CartDocument> = new mongoose.Schema({
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
