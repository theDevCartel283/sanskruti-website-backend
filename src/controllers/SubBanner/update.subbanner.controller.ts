import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import subBannerModel from "../../model/subBanner.model";
import { ReqBannerObject } from "../../schema/banner.schema";

const updateBanner = async (
  req: Request<{}, {}, ReqBannerObject & TokenPayload>,
  res: Response
) => {
  const id: any = req.query.id;

  const banner = await subBannerModel.findById(id);
  if (!banner) {
    return res.status(500).json({
      type: "error",
      message: "banner not found",
    });
  } else {
    await subBannerModel.findByIdAndUpdate(id, req.body, {
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
