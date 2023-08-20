import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import fs from "fs";
import bannerModel from "../../model/banner.model";
import axios from "axios";

const deleteBanner = async (req: Request, res: Response) => {
  const id: any = req.query.id;

  const banner = await bannerModel.findOne({ _id: id });

  if (!banner) {
    return res.status(500).json({
      type: "error",
      message: "Banner not found",
    });
  } else {
    const url1 = banner.desktopImage;
    const name1 = url1.split(`${process.env.CDN_ENDPOINT}/`)[1];
    if (url1 !== "") {
      await axios.delete(
        `${process.env.CDN_ENDPOINT}/cdn/v1/images/deleteImage?name=${name1}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const url2 = banner.mobileImage;
    const name2 = url2.split(`${process.env.CDN_ENDPOINT}/`)[1];
    if (url2 !== "") {
      await axios.delete(
        `${process.env.CDN_ENDPOINT}/cdn/v1/images/deleteImage?name=${name2}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    await bannerModel.deleteOne({ _id: id });
    res.status(200).json({
      type: "success",
      message: "Banner Deleted Successfully",
    });
  }
};

export default deleteBanner;
