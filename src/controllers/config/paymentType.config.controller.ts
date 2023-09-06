import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import ConfigModel from "../../model/config.model";
import { getPayZappCredentials } from "./payzapp.config.controller";

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
      await config.save();
    }

    res.status(200).send({
      cashondelivery: config?.paymentStatus?.cashondelivery,
      payZapp: config?.paymentStatus?.payZapp,
    });
  } catch (err) {
    logger.error("get payment status failed " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export const handleStartPayZapp = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    const { access_code, merchant_id, working_key } =
      await getPayZappCredentials();
    if (!access_code || !merchant_id || !working_key)
      return res.status(400).send({
        message: "payZapp credentials are not set",
        type: "error",
      });

    config.paymentStatus.payZapp = true;

    await config.save();
    res.status(200).send({
      message: "PayZapp activated",
      type: "success",
      cashondelivery: config?.paymentStatus?.cashondelivery,
      payZapp: config?.paymentStatus?.payZapp,
    });
  } catch (err) {
    logger.error("start payzapp failed " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export const handleStopPayZapp = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.paymentStatus.payZapp = false;

    await config.save();
    res.status(200).send({
      message: "PayZapp deactivated",
      type: "success",
      cashondelivery: config?.paymentStatus?.cashondelivery,
      payZapp: config?.paymentStatus?.payZapp,
    });
  } catch (err) {
    logger.error("stop payzapp failed " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export const handleStartCashOnDelivery = async (
  req: Request,
  res: Response
) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.paymentStatus.cashondelivery = true;

    await config.save();
    res.status(200).send({
      message: "Cash on Delivery activated",
      type: "success",
      cashondelivery: config?.paymentStatus?.cashondelivery,
      payZapp: config?.paymentStatus?.payZapp,
    });
  } catch (err) {
    logger.error("start cod failed " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export const handleStopCashOnDelivery = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.paymentStatus.cashondelivery = false;

    await config.save();
    res.status(200).send({
      message: "Cash on Delivery deactivated",
      type: "success",
      cashondelivery: config?.paymentStatus?.cashondelivery,
      payZapp: config?.paymentStatus?.payZapp,
    });
  } catch (err) {
    logger.error("stop cod failed " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};
