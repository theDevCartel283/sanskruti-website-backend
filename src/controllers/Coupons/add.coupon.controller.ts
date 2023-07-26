import { Request, Response } from "express";
import couponModel from "../../model/coupon.model";
import { ReqCouponObject } from "../../schema/coupon.schema";

const addCoupon = async (
  req: Request<{}, {}, ReqCouponObject>,
  res: Response
) => {
  const coupon = await couponModel.findOne({ title: req.body.title });

  if (coupon) {
    res.status(502).json({
      type: "warning",
      message: "coupon already exists!",
    });
  } else {
    const newCouponModel = new couponModel({
      title: req.body.title,
      is_published: req.body.is_published,
      expiry: req.body.expiry,
      code: req.body.code,
      discount: req.body.discount,
    });

    const newCoupon = await newCouponModel.save();
    res.status(200).json({
      type: "success",
      newCoupon,
      message: "Coupon added successfully",
    });
  }
};
export default addCoupon;
