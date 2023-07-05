import mongoose from "mongoose";
import { addressSchema } from "./user.model";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
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

  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentInfo: {
    status: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      default: "INR",
    },
    timestamp: {
      type: String,
    },
    referenceId: {
      type: String,
    },
  },
});

const PaymentModel = mongoose.model("Payment", paymentSchema);
export default PaymentModel;
