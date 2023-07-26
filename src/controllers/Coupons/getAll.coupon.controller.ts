import { Request, Response } from "express";
import ApiFeatures from "../../utils/apiFeatures.utils";
import couponModel from "../../model/coupon.model";

const getallCoupons = async (req: Request, res: Response) => {
  const couponCount: number = await couponModel.countDocuments();
  const apiFeatures = new ApiFeatures(couponModel.find(), req.query)
    .searchForBanner()
    .filter();
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
      couponCount,
    });
  }
};

export default getallCoupons;
