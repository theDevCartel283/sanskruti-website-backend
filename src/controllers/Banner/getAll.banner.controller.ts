import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import ApiFeatures from "../../utils/apiFeatures.utils";
import bannerModel from "../../model/banner.model";

const getallBanners = async (req: Request, res: Response) => {
  const bannerCount: number = await bannerModel.countDocuments();
  const apiFeatures = new ApiFeatures(bannerModel.find(), req.query)
    .searchForBanner()
    .filter();
  const banners = await apiFeatures.query;
  if (!banners) {
    res.status(401).json({
      type: "success",
      message: "no categories found",
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
