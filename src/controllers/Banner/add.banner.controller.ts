import { Request, Response } from "express";
import { ReqBannerObject } from "../../schema/banner.schema";
import bannerModel from "../../model/banner.model";

const addBanner = async (
  req: Request<{}, {}, ReqBannerObject>,
  res: Response
) => {
  const newBanner = new bannerModel({
    isPublished: req.body.isPublished,
    desktopImage: req.body.desktopImage,
    mobileImage: req.body.mobileImage,
  });

  await newBanner.save();

  res.status(200).json({
    type: "success",
    message: "Banner Added",
  });
};
export default addBanner;
