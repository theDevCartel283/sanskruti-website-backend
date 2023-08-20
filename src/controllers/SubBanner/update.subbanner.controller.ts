import { Request, Response } from "express";
import { TokenPayload } from "../../utils/jwt.utils";
import subBannerModel from "../../model/subBanner.model";
import { ReqBannerObject } from "../../schema/banner.schema";
import axios from "axios";

const updateBanner = async (
  req: Request<{}, {}, ReqBannerObject & TokenPayload>,
  res: Response
) => {
  const id: any = req.query.id;
  const desktop_image: string = req.body.desktopImage;
  const mobile_image: string = req.body.mobileImage;
  const banner = await subBannerModel.findById(id);
  if (!banner) {
    return res.status(500).json({
      type: "error",
      message: "sub banner not found",
    });
  } else {
    if (desktop_image.length < 100 && mobile_image.length < 100) {
      await subBannerModel.findByIdAndUpdate(
        id,
        {
          isPublished: req.body.isPublished,
          desktopImage: req.body.desktopImage,
          mobileImage: req.body.mobileImage,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      res.status(200).json({
        type: "success",
        message: "sub banner updated successfully",
      });
    } else if (desktop_image.length < 100 && mobile_image.length > 100) {
      const response2 = await axios.post(
        `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeImages`,
        {
          image: req.body.mobileImage.split(",")[1],
          imageName: req.body.mobileImageName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const mobile_data = response2.data;

      await subBannerModel.findByIdAndUpdate(
        id,
        {
          isPublished: req.body.isPublished,
          desktopImage: req.body.desktopImage,
          mobileImage: mobile_data.path,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      res.status(200).json({
        type: "success",
        message: "sub banner updated successfully",
      });
    } else if (desktop_image.length > 100 && mobile_image.length < 100) {
      const response1 = await axios.post(
        `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeImages`,
        {
          image: req.body.desktopImage.split(",")[1],
          imageName: req.body.desktopImageName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const desktop_data = response1.data;

      await subBannerModel.findByIdAndUpdate(
        id,
        {
          isPublished: req.body.isPublished,
          desktopImage: desktop_data.path,
          mobileImage: req.body.mobileImage,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      res.status(200).json({
        type: "success",
        message: "sub banner updated successfully",
      });
    } else {
      const response1 = await axios.post(
        `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeImages`,
        {
          image: req.body.desktopImage.split(",")[1],
          imageName: req.body.desktopImageName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response2 = await axios.post(
        `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeImages`,
        {
          image: req.body.mobileImage.split(",")[1],
          imageName: req.body.mobileImageName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const desktop_data = response1.data;
      const mobile_data = response2.data;

      await subBannerModel.findByIdAndUpdate(
        id,
        {
          isPublished: req.body.isPublished,
          desktopImage: desktop_data.path,
          mobileImage: mobile_data.path,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      res.status(200).json({
        type: "success",
        message: "sub banner updated successfully",
      });
    }
  }
};

export default updateBanner;
