import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  is_published: {
    type: Boolean,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});

const couponModel = mongoose.model("Coupon", couponSchema);
export default couponModel;
