import { Request, Response } from "express";
import couponModel from "../../model/coupon.model";
import { ReqCouponObject } from "../../schema/coupon.schema";
import logger from "../../utils/logger.utils";

const addCoupon = async (
  req: Request<{}, {}, ReqCouponObject>,
  res: Response
) => {
  try {
    const coupon = await couponModel.findOne({ code: req.body.code });

    if (coupon) {
      return res.status(502).json({
        type: "warning",
        message: "coupon already exists!",
      });
    } else {
      const newCouponModel = new couponModel({
        name: req.body.name,
        code: req.body.code,
        type: req.body.type,
        discountType: req.body.discountType,
        value: req.body.value,
        minPurchase: req.body.minPurchase,
        expirationDate: new Date(req.body.expirationDate),
        usedBy: [],
      });

      const newCoupon = await newCouponModel.save();
      return res.status(200).json({
        type: "success",
        coupon: newCoupon,
        message: "Coupon added successfully",
      });
    }
  } catch (err) {
    logger.error("add coupon error " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};
export default addCoupon;
