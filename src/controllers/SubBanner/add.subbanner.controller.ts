import { Request, Response } from "express";
import { ReqBannerObject } from "../../schema/banner.schema";
import subBannerModel from "../../model/subBanner.model";
import axios from "axios";

const addBanner = async (
  req: Request<{}, {}, ReqBannerObject>,
  res: Response
) => {
  const desktop_banner = {
    image: req.body.desktopImage.split(",")[1],
    imageName: req.body.desktopImageName,
  };
  const mobile_banner = {
    image: req.body.mobileImage.split(",")[1],
    imageName: req.body.mobileImageName,
  };
  const response1 = await axios.post(
    `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeImages`,
    desktop_banner,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const response2 = await axios.post(
    `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeImages`,
    mobile_banner,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const desktop_data = response1.data;
  const mobile_data = response2.data;
  const newBanner = new subBannerModel({
    isPublished: req.body.isPublished,
    desktopImage: desktop_data.path || "",
    mobileImage: mobile_data.path || "",
  });

  await newBanner.save();

  res.status(200).json({
    type: "success",
    message: "Sub-Banner Added",
  });
};
export default addBanner;
