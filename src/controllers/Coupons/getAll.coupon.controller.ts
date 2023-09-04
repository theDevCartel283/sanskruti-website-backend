import { Request, Response } from "express";
import ApiFeatures from "../../utils/apiFeatures.utils";
import couponModel from "../../model/coupon.model";

const getallCoupons = async (req: Request, res: Response) => {
  const apiFeatures = new ApiFeatures(
    couponModel.find(),
    req.query
  ).searchForCoupon();
  const coupons = await apiFeatures.query;
  if (!coupons) {
    res.status(401).json({
      type: "success",
      message: "no coupons found",
    });
  } else {
    res.status(200).json({
      type: "success",
      coupons,
    });
  }
};

export default getallCoupons;
