import mongoose, { Document, Schema, Model } from "mongoose";
import { Address, addressSchema } from "./user.model";

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
  order_status?:
    | "Success"
    | "Failure"
    | "Aborted"
    | "Invalid"
    | "Timeout"
    | "Pending";
  tracking_id?: string;
  bank_ref_no?: string;
  payment_mode?: string;
  card_name?: string;
  currency?: string;
  trans_date?: string;
  amount?: number;
}

export interface CCAveneueResponse {
  reference_no: number;
  order_no: string;
  order_currncy: string;
  order_amt: number;
  order_date_time: Date;
  order_bill_name: string;
  order_bill_address: string;
  order_bill_zip: string;
  order_bill_tel: string;
  order_bill_email: string;
  order_bill_country: string;
  order_ship_name: string;
  order_ship_address: string;
  order_ship_country: string;
  order_ship_tel: string;
  order_bill_city: string;
  order_bill_state: string;
  order_ship_state: string;
  order_ship_zip: string;
  order_ship_email: string;
  order_notes: string;
  order_ip: string;
  order_status:
    | "Shipped"
    | "Unsuccessful"
    | "Aborted"
    | "Invalid"
    | "Initiated";
  order_fraud_status: string;
  order_status_date_time: string;
  order_capt_amt: number;
  order_card_name: string;
  order_delivery_details: string;
  order_fee_perc_value: number;
  order_fee_perc: number;
  order_fee_flat: number;
  order_gross_amt: number;
  order_discount: number;
  order_tax: number;
  order_bank_ref_no: string;
  order_gtw_id: string;
  order_bank_response: string;
  order_option_type: string;
  order_TDS: string;
  order_device_type: string;
  order_type: string;
  ship_date_time: string;
  payment_mode: string;
  card_type: string;
  sub_acc_id: string;
  order_bin_country: string;
  order_stlmt_date: string;
  card_enrolled: string;
  merchant_param1: string;
  merchant_param2: string;
  merchant_param3: string;
  merchant_param4: string;
  merchant_param5: string;
  order_bank_arn_no: string;
  order_split_payout: string;
  emi_issuing_bank: string;
  tenure_duration: string;
  emi_discount_type: string;
  emi_discount_value: string;
}

// Interface representing the "Payment" document
export interface PaymentDocument extends Document {
  userId: string;
  orderId: string;
  paymentMethod: "COD" | "PayZapp";
  orderInfo: OrderInfo;
  shippingAddress: Address;
  billingAddress: Address;
  secret: string;
  paymentInfo: PaymentInfo[];
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
  secret: {
    type: String,
  },
  paymentInfo: [
    {
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
    },
  ],
});

const PaymentModel: Model<PaymentDocument> = mongoose.model<PaymentDocument>(
  "Payment",
  paymentSchema
);
export default PaymentModel;
