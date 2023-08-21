import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import logger from "../../utils/logger.utils";
import couponModel from "../../model/coupon.model";
import { dateFormater } from "../../utils/dateFormater";

const handleUseCoupon = async (
  req: Request<{}, {}, TokenPayload & { code: string; price: number }>,
  res: Response
) => {
  const { userUniqueIdentity } = req.body;
  try {
    const coupon = await couponModel.findOne({ code: req.body.code });

    if (!coupon)
      return res.status(404).send({
        message: "Coupon doesn't exist",
        type: "info",
      });

    if (coupon.minPurchase > req.body.price) {
      return res.status(403).send({
        message: "Cannot avail coupon",
        content: `User must shop for a minimum price of Rs.${coupon.minPurchase} to avail the coupon`,
        type: "info",
      });
    }

    // check used by user
    const couponNotUsedByUser = !coupon.usedBy.includes(
      userUniqueIdentity.toString()
    );
    if (!couponNotUsedByUser) {
      return res.status(403).send({
        message: "Coupon Is Used",
        content: `Coupon has been used by user`,
        type: "info",
      });
    }

    // check expiry
    const todayDate = new Date().getTime();
    const expirationDate = coupon.expirationDate.getTime();
    const couponNotExpired = expirationDate > todayDate;

    if (!couponNotExpired) {
      return res.status(403).send({
        message: "Coupon expired",
        content: `Coupon has expired on ${dateFormater(coupon.expirationDate)}`,
        type: "info",
      });
    }

    const couponDiscount =
      coupon.discountType === "percentage"
        ? ((coupon.value * req.body.price) / 100).toFixed(2)
        : coupon.value;

    res.status(200).send({
      couponDiscount,
      code: coupon.code,
    });
  } catch (err) {
    logger.error("use coupon error " + err);
    return res
      .status(500)
      .send({ message: "something went wrong", type: "info" });
  }
};

export default handleUseCoupon;
