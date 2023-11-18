import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import ConfigModel from "../../model/config.model";

export const handleSetGoogleAnalytics = async (
  req: Request<{}, {}, { code: string }>,
  res: Response
) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
      await config.save();
    }

    config.analytics = {
      google: req.body.code,
    };
    await config.save();
    return res
      .status(200)
      .send({ message: "Google Tag Manager set successfully", type: "succes" });
  } catch (err) {
    logger.error("set google tag manager error " + err);
    return res
      .status(500)
      .send({ message: "something went wrong", type: "error" });
  }
};

export const handleGetGoogleAnalytics = async (req: Request, res: Response) => {
  try {
    const googleAnalytics = await ConfigModel.findOne({ type: "production" });
    if (!googleAnalytics)
      return res.status(500).send({
        message: "something went wrong",
        type: "info",
      });

    return res.status(200).send({ code: googleAnalytics.analytics?.google });
  } catch (err) {
    logger.error("get Google Tag Manager error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleDeleteGoogleAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const googleAnalytics = await ConfigModel.findOne({ type: "production" });
    if (!googleAnalytics)
      return res.status(200).send({
        message: "Successfully deleted google tag manager",
        type: "success",
      });

    googleAnalytics.analytics = {
      google: "",
    };
    await googleAnalytics.save();
    return res.status(200).send({
      message: "Successfully deleted google tag manager",
      type: "success",
    });
  } catch (err) {
    logger.error("delete google tag manager error");
    return res.status(500).send({
      message: "Something went wrong",
      type: "error",
    });
  }
};
