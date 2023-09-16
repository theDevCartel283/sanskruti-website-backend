import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import ConfigModel from "../../model/config.model";
import { ReqSetSocial, ReqUpdateSocial } from "../../schema/config.schema";
import { v4 as uuid } from "uuid";
import axios from "axios";

export const handleGetSocialConfig = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    return {
      social: config.social || [],
    };
  } catch (err) {
    logger.error("social config error " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const GetAllSocialConfig = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.find({ type: "production" });

    res.status(200).json({
      arr: config[0].social || [],
    });
  } catch (err) {
    logger.error("social config error " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleSetSocialConfig = async (
  req: Request<{}, {}, ReqSetSocial>,
  res: Response
) => {
  try {
    const { Image, imageName, media } = req.body;
    const temp = {
      image: Image.split(",")[1],
      imageName: imageName,
    };
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    const response = await axios.post(
      `${process.env.CDN_ENDPOINT}/cdn/v1/images/svgUpload`,
      temp,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    config.social?.push({
      id: uuid(),
      link: data.path || "",
      media,
    });
    await config.save();
    res.status(200).json({
      type: "success",
      message: "added successfully",
    });
  } catch (err) {
    logger.error("social config error " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleUpdateSocialConfig = async (
  req: Request<{}, {}, ReqUpdateSocial>,
  res: Response
) => {
  try {
    const { id, media } = req.body;
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.social?.map((social) => (social.id === id ? { id, media } : social));
    await config.save();

    return {
      social: config.social || [],
    };
  } catch (err) {
    logger.error("social config error " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleDeleteSocialConfig = async (
  req: Request<{}, {}, {}, { id: string }>,
  res: Response
) => {
  try {
    const { id } = req.query;
    console.log(req.query);
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.social?.forEach(async (i) => {
      if (i.id === id) {
        const url = i.link;
        const name = url.split(`${process.env.CDN_ENDPOINT}/`)[1];
        if (url !== "") {
          const response = await axios.delete(
            `${process.env.CDN_ENDPOINT}/cdn/v1/images/deleteImage?name=${name}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
    });

    config.social = config.social?.filter((social) => social.id !== id);
    await config.save();
    res.status(200).json({
      message: "deleted successfully",
      type: "success",
    });
  } catch (err) {
    logger.error("social config error " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};
