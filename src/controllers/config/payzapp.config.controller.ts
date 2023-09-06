import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import ConfigModel from "../../model/config.model";
import { ReqConfigPayment } from "../../schema/config.schema";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

const encrypt = (value: string) => {
  const token = jwt.sign(value, env.PAYMENT_PRIVATE, {
    algorithm: "RS256",
  });
  return token;
};

const decrypt = (token: string) => {
  const value = jwt.verify(token, env.PAYMENT_PUBLIC);
  return value.toString();
};

export const getPayZappCredentials = async () => {
  let config = await ConfigModel.findOne({ type: "production" });
  return {
    merchant_id: config?.payZapp?.merchant_id
      ? decrypt(config.payZapp?.merchant_id)
      : "",
    working_key: config?.payZapp?.working_key
      ? decrypt(config.payZapp?.working_key)
      : "",
    access_code: config?.payZapp?.access_code
      ? decrypt(config.payZapp?.access_code)
      : "",
  };
};

export const handleGetPayZApp = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
      await config.save();
    }

    return res.status(200).send({
      merchant_id: config.payZapp?.merchant_id
        ? decrypt(config.payZapp?.merchant_id).slice(0, 4) + "••••••••••"
        : "",
      working_key: config.payZapp?.working_key
        ? decrypt(config.payZapp?.working_key).slice(0, 4) + "••••••••••"
        : "",
      access_code: config.payZapp?.access_code
        ? decrypt(config.payZapp?.access_code).slice(0, 4) + "••••••••••"
        : "",
    });
  } catch (err) {
    logger.error("set payzapp " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleSetPayZApp = async (
  req: Request<{}, {}, ReqConfigPayment>,
  res: Response
) => {
  try {
    const { access_code, merchant_id, working_key } = req.body;
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.payZapp = {
      access_code: !!access_code
        ? encrypt(access_code)
        : config?.payZapp?.access_code,
      merchant_id: !!merchant_id
        ? encrypt(merchant_id)
        : config?.payZapp?.merchant_id,
      working_key: !!working_key
        ? encrypt(working_key)
        : config?.payZapp?.working_key,
    };
    await config.save();

    return res.status(200).send({
      merchant_id: merchant_id ? merchant_id.slice(0, 4) + "••••••••••" : "",
      working_key: working_key ? working_key.slice(0, 4) + "••••••••••" : "",
      access_code: access_code ? access_code.slice(0, 4) + "••••••••••" : "",
    });
  } catch (err) {
    logger.error("set payzapp " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleDeletePayZApp = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.payZapp = {
      access_code: "",
      merchant_id: "",
      working_key: "",
    };
    await config.save();

    return res.status(200).send({
      merchant_id: "",
      working_key: "",
      access_code: "",
    });
  } catch (err) {
    logger.error("set payzapp " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};
