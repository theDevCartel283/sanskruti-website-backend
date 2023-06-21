import mongoose from "mongoose";

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
      discount: {
        type: Number,
        required: true,
      },
      gst: {
        type: Number,
        required: true,
      },
      price: {
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
    email: {
      type: String,
      required: true,
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
