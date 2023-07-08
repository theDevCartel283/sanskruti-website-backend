import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import fs from "fs";
import subBannerModel from "../../model/subBanner.model";

const deleteBanner = async (req: Request, res: Response) => {
  const id: any = req.query.id;

  const banner = await subBannerModel.findOne({ _id: id });

  if (!banner) {
    return res.status(500).json({
      type: "error",
      message: "Banner not found",
    });
  } else {
    await subBannerModel.deleteOne({ _id: id });
    res.status(200).json({
      type: "success",
      message: "Banner Deleted Successfully",
    });
  }
};

export default deleteBanner;
