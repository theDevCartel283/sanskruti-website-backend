import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import couponModel from "../../model/coupon.model";

/**
 * ## Handle Delete Coupon
 * deletes a coupon base on the code provided
 * @param req
 * @param res
 * @returns
 */
const handleDeleteCoupon = async (
  req: Request<{}, {}, {}, { code: string }>,
  res: Response
) => {
  try {
    const coupon = await couponModel.findOne({ code: req.query.code });
    if (!coupon)
      return res.status(404).send({
        message: "coupon not found",
        type: "info",
      });

    await couponModel.deleteOne({ code: req.query.code });
    return res.status(200).send({
      message: `coupon CODE:${coupon.code} successfully deleted`,
      type: "success",
    });
  } catch (err) {
    logger.error("delete coupon error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export default handleDeleteCoupon;
