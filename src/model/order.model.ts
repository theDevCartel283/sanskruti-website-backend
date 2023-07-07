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
    slug: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand_name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        default: null,
      },
    ],
    gst_percent: {
      type: Number,
      required: true,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
    },
    varient: {
      price: {
        type: Number,
        required: true,
      },
      variations: {},
      discount: {
        type: Number,
      },
    },
  },
  deliveryInfo: {
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
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
