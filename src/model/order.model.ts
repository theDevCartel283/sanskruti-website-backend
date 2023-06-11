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
  paymentInfo: {},
});

module.exports = mongoose.model("Order", orderSchema);
