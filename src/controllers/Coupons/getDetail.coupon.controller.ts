import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import couponModel from "../../model/coupon.model";

const GetCouponDetails = async (
  req: Request<{}, {}, TokenPayload>,
  res: Response
) => {
  const id = req.query.id;
  try {
    const CouponDetail = await couponModel.findById(id);

    if (!CouponDetail)
      return res
        .status(500)
        .json({ message: "something went wrong", type: "error" });

    return res.status(200).json({ coupon: CouponDetail });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", type: "error" });
  }
};

export default GetCouponDetails;
