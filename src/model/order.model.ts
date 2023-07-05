import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  product: {
    id: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    varient: {
      type: Array,
      required: true,
    },
  },
  cancellationInfo: {
    isCancelled: {
      type: Boolean,
      required: true,
      default: false,
    },

    Amount_refunded: {
      type: Boolean,
      required: true,
    },
  },
  returnInfo: {
    isReturned: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: true,
      default: null,
    },
    Amount_refunded: {
      type: Boolean,
      required: true,
    },
  },
});

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
