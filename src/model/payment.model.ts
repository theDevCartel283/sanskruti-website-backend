import mongoose, { Document, Schema, Model } from "mongoose";
import { addressSchema } from "./user.model";

// Interface representing the fields of the "orderInfo" object
interface OrderInfo {
  Date: Date;
  SubTotal: number;
  ShippingCost: number;
  CouponCode?: string;
  CouponDiscount?: number;
  Totaldiscount: number;
  TotalGST: number;
  Amount: number;
}

// Interface representing the "paymentInfo" object
interface PaymentInfo {
  order_status?: string;
  tracking_id?: string;
  bank_ref_no?: string;
  payment_mode?: string;
  card_name?: string;
  currency?: string;
  trans_date?: string;
  amount?: number;
  secret: string;
}

// Interface representing the "Payment" document
export interface PaymentDocument extends Document {
  userId: string;
  orderId: string;
  paymentMethod: "COD" | "PayZapp";
  orderInfo: OrderInfo;
  shippingAddress: unknown; // Replace "unknown" with the actual address schema type
  billingAddress: unknown; // Replace "unknown" with the actual address schema type
  paymentInfo: PaymentInfo;
}

// Define the paymentSchema
const paymentSchema: Schema<PaymentDocument> = new mongoose.Schema({
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
    SubTotal: {
      type: Number,
      required: true,
    },
    ShippingCost: {
      type: Number,
      required: true,
    },
    CouponCode: {
      type: String,
    },
    CouponDiscount: {
      type: Number,
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

  shippingAddress: {
    type: addressSchema,
  },
  billingAddress: {
    type: addressSchema,
  },
  paymentInfo: {
    order_status: {
      type: String,
    },
    tracking_id: {
      type: String,
    },
    bank_ref_no: {
      type: String,
    },
    payment_mode: {
      type: String,
    },
    card_name: {
      type: String,
    },
    currency: {
      type: String,
    },
    trans_date: {
      type: String,
    },
    amount: {
      type: Number,
    },
    secret: {
      type: String,
    },
  },
});

const PaymentModel: Model<PaymentDocument> = mongoose.model<PaymentDocument>(
  "Payment",
  paymentSchema
);
export default PaymentModel;
