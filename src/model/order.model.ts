import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    id: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      default: null,
    },
    contactNo: {
      type: Number,
      required: true,
      default: null,
    },
    pincode: {
      type: Number,
      required: true,
      default: null,
    },
    nearBy: {
      type: String,
      required: true,
      default: null,
    },
    landmark: {
      type: String,
      required: true,
      default: null,
    },
    city: {
      type: String,
      required: true,
      default: null,
    },
    state: {
      type: String,
      required: true,
      default: null,
    },
  },
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
});

module.exports = mongoose.model("Order", orderSchema);
