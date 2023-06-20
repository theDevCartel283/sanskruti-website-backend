import { Request, Response } from "express";
import { ReqBannerObject } from "../../schema/banner.schema";
import bannerModel from "../../model/banner.model";

const addBanner = async (
  req: Request<{}, {}, ReqBannerObject>,
  res: Response
) => {
  const newBanner = new bannerModel({
    type: req.body.type,
    isPublished: req.body.isPublished,
    image: req.body.image,
  });

  await newBanner.save();

  res.status(200).json({
    type: "success",
    message: "Banner Added",
  });
};
export default addBanner;
