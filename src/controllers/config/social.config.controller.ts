import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import ConfigModel from "../../model/config.model";
import { ReqSetSocial, ReqUpdateSocial } from "../../schema/config.schema";
import { v4 as uuid } from "uuid";

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

export const handleSetSocialConfig = async (
  req: Request<{}, {}, ReqSetSocial>,
  res: Response
) => {
  try {
    const { link, media } = req.body;
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.social?.push({
      id: uuid(),
      link,
      media,
    });
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

export const handleUpdateSocialConfig = async (
  req: Request<{}, {}, ReqUpdateSocial>,
  res: Response
) => {
  try {
    const { id, link, media } = req.body;
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.social?.map((social) =>
      social.id === id ? { id, link, media } : social
    );
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
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.social?.filter((social) => social.id !== id);
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
