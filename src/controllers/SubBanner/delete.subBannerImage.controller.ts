import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import subBannerModel from "../../model/subBanner.model";

const deleteSubBannerImage = async (req: Request, res: Response) => {
  const bannerAlreadyExists = await subBannerModel.findOne({
    _id: req.query._id,
  });
  console.log(req.query);
  const url_params = req.query;
  const type = req.query.type;
  const response = await axios.delete(
    `${process.env.CDN_ENDPOINT}/cdn/v1/images/deleteImage?name=${url_params.name}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = response.data;

  if (bannerAlreadyExists) {
    if (type === "desktop") {
      bannerAlreadyExists.desktopImage = "";
    } else {
      bannerAlreadyExists.mobileImage = "";
    }
    await bannerAlreadyExists.save({
      validateBeforeSave: false,
    });
    res.status(200).json({
      type: "success",
      message: "sub banner deleted successfully",
    });
  } else {
    res.status(500).json({
      type: "error",
      message: "sub banner does not exist",
    });
  }
};

export default deleteSubBannerImage;
