import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import ConfigModel from "../../model/config.model";

export const handleSetWhatsappNumber = async (
  req: Request<{}, {}, { number: number }>,
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

    config.whatsapp = req.body.number;
    await config.save();
    return res
      .status(200)
      .send({ message: "Whatsapp number set successfully", type: "succes" });
  } catch (err) {
    logger.error("set Whatsapp number error " + err);
    return res
      .status(500)
      .send({ message: "something went wrong", type: "error" });
  }
};

export const handleGetWhatsappNumber = async (req: Request, res: Response) => {
  try {
    const config = await ConfigModel.findOne({ type: "production" });
    if (!config)
      return res.status(500).send({
        message: "something went wrong",
        type: "info",
      });

    return res.status(200).send({ number: config.whatsapp });
  } catch (err) {
    logger.error("get Whatsapp Number error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleDeleteWhatsappNumber = async (
  req: Request,
  res: Response
) => {
  try {
    const config = await ConfigModel.findOne({ type: "production" });
    if (!config)
      return res.status(200).send({
        message: "Successfully deleted Whatsapp Number",
        type: "success",
      });

    config.whatsapp = undefined;
    await config.save();
    return res.status(200).send({
      message: "Successfully deleted Whatsapp Number",
      type: "success",
    });
  } catch (err) {
    logger.error("delete Whatsapp Number error");
    return res.status(500).send({
      message: "Something went wrong",
      type: "error",
    });
  }
};
