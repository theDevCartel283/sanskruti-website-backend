import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { ReqProductObjectWithName } from "../../schema/product.schema";
import { TokenPayload } from "../../utils/jwt.utils";
import bannerModel from "../../model/banner.model";

const updateBanner = async (
  req: Request<{}, {}, ReqProductObjectWithName & TokenPayload>,
  res: Response
) => {
  const id: any = req.query.id;

  const banner = await bannerModel.findById(id);
  if (!banner) {
    return res.status(500).json({
      type: "error",
      message: "banner not found",
    });
  } else {
    await bannerModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      type: "success",
      message: "banner updated successfully",
    });
  }
};

export default updateBanner;
