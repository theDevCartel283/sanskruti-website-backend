import { Request, Response } from "express";
import bannerModel from "../../model/banner.model";

const getallBanners = async (req: Request, res: Response) => {
  const banners = await bannerModel.find();
  const bannerCount: number = await bannerModel.countDocuments();
  if (!banners) {
    res.status(401).json({
      type: "warning",
      message: "no banners  found",
    });
  } else {
    res.status(200).json({
      type: "success",
      banners,
      bannerCount,
    });
  }
};

export default getallBanners;
