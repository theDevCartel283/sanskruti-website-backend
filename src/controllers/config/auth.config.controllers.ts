import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import ConfigModel from "../../model/config.model";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { ReqConfigAuth } from "../../schema/config.schema";

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

export const getGoogleAuthKeys = async () => {
  let config = await ConfigModel.findOne({ type: "production" });
  return {
    secret: config?.auth?.google?.secret
      ? decrypt(config?.auth?.google?.secret)
      : "",
    clientId: config?.auth?.google?.clientId
      ? decrypt(config?.auth?.google?.clientId)
      : "",
  };
};

export const getFacebookAuthKeys = async () => {
  let config = await ConfigModel.findOne({ type: "production" });
  return {
    secret: config?.auth?.facebook?.secret
      ? decrypt(config?.auth?.facebook?.secret)
      : "",
    clientId: config?.auth?.facebook?.clientId
      ? decrypt(config?.auth?.facebook?.clientId)
      : "",
  };
};

export const handleGetAuthStatus = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
      await config.save();
    }

    res.status(200).send({
      google: config?.auth?.status?.google,
      facebook: config?.auth?.status?.facebook,
    });
  } catch (err) {
    logger.error("get payment status failed " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export const handleStartGoogleAuth = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    const { clientId, secret } = await getGoogleAuthKeys();
    if (!clientId || !secret)
      return res.status(400).send({
        message: "google keys are not set",
        type: "error",
      });

    if (config.auth && config.auth.status) {
      config.auth.status.google = true;
    } else {
      config.auth = {
        status: {
          google: true,
          facebook: false,
        },
      };
    }

    await config.save();
    res.status(200).send({
      message: "Google Auth activated",
      type: "success",
      google: config?.auth?.status?.google,
      facebook: config?.auth?.status?.facebook,
    });
  } catch (err) {
    logger.error("start google auth failed " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export const handleStopGoogleAuth = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }
    config.auth!.status!.google = false;

    await config.save();
    res.status(200).send({
      message: "Google Auth deactivated",
      type: "success",
      google: config?.auth?.status?.google,
      facebook: config?.auth?.status?.facebook,
    });
  } catch (err) {
    logger.error("stop payzapp failed " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export const handleGetGoogleAuth = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    return res.status(200).send({
      clientId: config?.auth?.google?.clientId
        ? decrypt(config?.auth.google.clientId).slice(0, 4) + "••••••••••"
        : "",
      secret: config?.auth?.google?.secret
        ? decrypt(config?.auth.google.secret).slice(0, 4) + "••••••••••"
        : "",
    });
  } catch (err) {
    logger.error("handel get google auth error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleSetGoogleAuth = async (
  req: Request<{}, {}, ReqConfigAuth>,
  res: Response
) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    const { clientId, secret } = req.body;

    config.auth.google = {
      clientId: clientId
        ? encrypt(clientId)
        : config.auth.google?.clientId || "",
      secret: secret ? encrypt(secret) : config.auth.google?.secret || "",
    };
    await config.save();

    return res.status(200).send({
      clientId: config?.auth.google.clientId
        ? decrypt(config?.auth.google.clientId).slice(0, 4) + "••••••••••"
        : "",
      secret: config?.auth.google.secret
        ? decrypt(config?.auth.google.secret).slice(0, 4) + "••••••••••"
        : "",
      message: "Google auth key set",
      type: "success",
    });
  } catch (err) {
    logger.error("handel set google auth error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleClearGoogleAuth = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.auth.google = {
      clientId: "",
      secret: "",
    };
    if (config?.auth?.status?.google) config.auth.status.google = false;
    await config.save();

    return res.status(200).send({
      clientId: "",
      secret: "",
      message: "Google auth key cleared",
      type: "success",
      google: config?.auth?.status?.google,
      facebook: config?.auth?.status?.facebook,
    });
  } catch (err) {
    logger.error("handle clear google auth error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

// Facebook
export const handleStartFacebookAuth = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    const { clientId, secret } = await getFacebookAuthKeys();
    if (!clientId || !secret)
      return res.status(400).send({
        message: "facebook keys are not set",
        type: "error",
      });

    if (config.auth && config.auth.status) {
      config.auth.status.facebook = true;
    } else {
      config.auth = {
        status: {
          facebook: true,
          google: false,
        },
      };
    }

    await config.save();
    res.status(200).send({
      message: "Facebook Auth activated",
      type: "success",
      google: config?.auth?.status?.google,
      facebook: config?.auth?.status?.facebook,
    });
  } catch (err) {
    logger.error("start facebook auth failed " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export const handleStopFacebookAuth = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }
    config.auth!.status!.facebook = false;

    await config.save();
    res.status(200).send({
      message: "Facebook Auth deactivated",
      type: "success",
      google: config?.auth?.status?.google,
      facebook: config?.auth?.status?.facebook,
    });
  } catch (err) {
    logger.error("stop facebook auth failed " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export const handleGetFacebookAuth = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    return res.status(200).send({
      clientId: config?.auth?.facebook?.clientId
        ? decrypt(config?.auth.facebook.clientId).slice(0, 4) + "••••••••••"
        : "",
      secret: config?.auth?.facebook?.secret
        ? decrypt(config?.auth.facebook.secret).slice(0, 4) + "••••••••••"
        : "",
    });
  } catch (err) {
    logger.error("handle get Facebook auth error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleSetFacebookAuth = async (
  req: Request<{}, {}, ReqConfigAuth>,
  res: Response
) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    const { clientId, secret } = req.body;

    config.auth.facebook = {
      clientId: clientId
        ? encrypt(clientId)
        : config.auth.facebook?.clientId || "",
      secret: secret ? encrypt(secret) : config.auth.facebook?.secret || "",
    };
    await config.save();

    return res.status(200).send({
      clientId: config?.auth.facebook.clientId
        ? decrypt(config?.auth.facebook.clientId).slice(0, 4) + "••••••••••"
        : "",
      secret: config?.auth.facebook.secret
        ? decrypt(config?.auth.facebook.secret).slice(0, 4) + "••••••••••"
        : "",
      message: "Facebook auth key set",
      type: "success",
    });
  } catch (err) {
    logger.error("handle set Facebook auth error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export const handleClearFacebookAuth = async (req: Request, res: Response) => {
  try {
    let config = await ConfigModel.findOne({ type: "production" });

    if (!config) {
      config = new ConfigModel({
        type: "production",
      });
    }

    config.auth.facebook = {
      clientId: "",
      secret: "",
    };
    if (config?.auth?.status?.facebook) config.auth.status.facebook = false;
    await config.save();

    return res.status(200).send({
      clientId: "",
      secret: "",
      message: "Facebook auth key cleared",
      type: "success",
      google: config?.auth?.status?.google,
      facebook: config?.auth?.status?.facebook,
    });
  } catch (err) {
    logger.error("handle clear facebook auth error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};
