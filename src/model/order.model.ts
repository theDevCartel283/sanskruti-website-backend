import mongoose, { Document, Schema } from "mongoose";

interface Product {
  id: string;
  slug: string;
  name: string;
  brand_name: string;
  images: string[];
  gst_percent: number;
  quantity: number;
  varient: {
    price: number;
    variations: Record<string, any>;
    discount?: number;
  };
}

interface DeliveryInfo {
  date: Date;
  status: "Pending" | "Confirmed" | "Out for delivery" | "Delivered";
}

interface CancellationInfo {
  isCancelled: boolean;
  date?: Date;
  Amount_refunded: boolean;
}

interface ReturnInfo {
  isReturned: boolean;
  date?: Date;
  status:
    | "Null"
    | "Pending"
    | "Confirmed"
    | "Out for pickup"
    | "Refund initiated"
    | "Refund credited";
  Amount_refunded: boolean;
}

export interface Order extends Document {
  userId: string;
  orderId: string;
  product: Product;
  deliveryInfo: DeliveryInfo;
  cancellationInfo: CancellationInfo;
  returnInfo: ReturnInfo;
}

const orderSchema: Schema<Order> = new mongoose.Schema({
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
    date: {
      type: Date,
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
    date: {
      type: Date,
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
