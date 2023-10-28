import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import bannerModel from "../../model/banner.model";

const handleGetBannerById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const banner = await bannerModel.findById(id);

    if (!banner)
      return res.status(404).send({
        message: "banner not found",
        type: "error",
      });

    return res.status(200).send({
      banner,
    });
  } catch (err) {
    logger.error("handle get banner " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetBannerById;
