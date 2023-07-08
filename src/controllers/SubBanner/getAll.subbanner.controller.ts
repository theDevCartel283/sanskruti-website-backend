import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import ApiFeatures from "../../utils/apiFeatures.utils";
import subBannerModel from "../../model/subBanner.model";

const getallBanners = async (req: Request, res: Response) => {
  const subBannerCount: number = await subBannerModel.countDocuments();
  const apiFeatures = new ApiFeatures(subBannerModel.find(), req.query)
    .searchForBanner()
    .filter();
  const subBanners = await apiFeatures.query;
  if (!subBanners) {
    res.status(401).json({
      type: "success",
      message: "no categories found",
    });
  } else {
    res.status(200).json({
      type: "success",
      subBanners,
      subBannerCount,
    });
  }
};

export default getallBanners;
