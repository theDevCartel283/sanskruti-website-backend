import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import couponModel from "../../model/coupon.model";
import logger from "../../utils/logger.utils";

const handleFetchCouponForUser = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { userUniqueIdentity } = req.body;

    const coupons = await couponModel.find({ type: "multiple" });
    const filteredCoupons = coupons.filter(
      (coupon) => !coupon.usedBy.includes(userUniqueIdentity.toString())
    );

    return res.status(200).json({ coupons: filteredCoupons });
  } catch (err) {
    logger.error("coupon fetch for user error " + err);
    return res.sendStatus(500);
  }
};

export default handleFetchCouponForUser;
