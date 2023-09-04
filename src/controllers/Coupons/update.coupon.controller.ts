import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import couponModel from "../../model/coupon.model";
import { ReqCouponObject } from "../../schema/coupon.schema";

/**
 * ## Handle Update Coupon
 * Handles the update of a coupon based on the provided request data.
 *
 * request body:
 * ```
 * {
 *    previousCode: string
 *    code: string;
 *    value: number;
 *    type: "oneTime" | "multiple";
 *    discountType: "percentage" | "price";
 *    minPurchase: number;
 *    expirationDate: string
 * }
 * ```
 * @async
 * @param {import('express').Request<{}, {}, ReqCouponObject & { previousCode: string }>} req - The Express request object containing coupon update information.
 * @param {import('express').Response} res - The Express response object used to send the response.
 * @returns {Promise<void>} A Promise that resolves after handling the coupon update.
 * @throws {Error} If an error occurs during the coupon update process
 */
const handleUpdateCoupon = async (
  req: Request<{}, {}, ReqCouponObject & { previousCode: string }>,
  res: Response
) => {
  try {
    const coupon = await couponModel.findOne({ code: req.body.previousCode });

    if (!coupon)
      return res.status(404).send({
        message: "coupon not found found",
        type: "info",
      });

    // update coupone
    coupon.name = req.body.name;
    coupon.code = req.body.code;
    coupon.value = req.body.value;
    coupon.type = req.body.type;
    coupon.discountType = req.body.discountType;
    coupon.minPurchase = req.body.minPurchase;
    coupon.expirationDate = new Date(req.body.expirationDate);

    // save coupon
    await coupon.save();

    return res.status(200).send({
      message: "coupon successfully updated",
      type: "success",
      coupon,
    });
  } catch (err) {
    logger.error("update coupon err " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export default handleUpdateCoupon;
