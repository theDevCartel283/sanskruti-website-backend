import mongoose from "mongoose";
import { addressSchema } from "./user.model";

const orderSchema = new mongoose.Schema({
  userInfo: {
    id: {
      type: String,
      required: true,
    },
  },
  orderItems: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      varient: {},
      gst: {
        type: Number,
        required: true,
      },
    },
  ],
  orderInfo: {
    Date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    SubTotal: {
      type: Number,
      required: true,
    },
    ShippingCost: {
      type: Number,
      required: true,
    },
    Totaldiscount: {
      type: Number,
      required: true,
    },
    TotalGST: {
      type: Number,
      required: true,
    },
    Amount: {
      type: Number,
      required: true,
    },
  },
  shippingInfo: addressSchema,
  paymentInfo: {
    status: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    timestamp: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    referenceId: {
      type: String,
      required: true,
    },
  },
  cancellationInfo: {
    returnRequest: {
      type: Boolean,
      required: true,
      default: false,
    },
    isCancelled: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: true,
      default: null,
    },
    Amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  returnInfo: {
    cancelRequest: {
      type: Boolean,
      required: true,
      default: false,
    },

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
    Amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
