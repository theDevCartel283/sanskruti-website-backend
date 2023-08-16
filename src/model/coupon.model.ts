import mongoose, { Document, Schema } from "mongoose";

export interface Coupon {
  code: string;
  type: "oneTime" | "multiple";
  discountType: "percentage" | "price";
  value: number;
  minPurchase: number;
  expirationDate: Date;
  usedBy: string[];
}

interface CouponDocument extends Document, Coupon {}

const couponSchema: Schema<CouponDocument> =
  new mongoose.Schema<CouponDocument>({
    code: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    minPurchase: {
      type: Number,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    usedBy: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  });

const couponModel = mongoose.model("Coupon", couponSchema);
export default couponModel;
