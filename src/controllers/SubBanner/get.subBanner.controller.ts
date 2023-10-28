import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import subBannerModel from "../../model/subBanner.model";

const handleGetSubBannerById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const subBanner = await subBannerModel.findById(id);

    if (!subBanner)
      return res.status(404).send({
        message: "sub banner not found",
        type: "error",
      });

    return res.status(200).send({
      subBanner,
    });
  } catch (err) {
    logger.error("handle get sub banner from id" + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetSubBannerById;
