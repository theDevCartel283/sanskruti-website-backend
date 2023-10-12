import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { Reviews, reviewModel } from "../../model/review.model";

const handleGetReviewFilters = async (
  req: Request<
    {},
    {},
    {
      product_name?: string;
      notify?: boolean;
      status?: Reviews["status"];
      rating?: string;
      page: number;
    }
  >,
  res: Response
) => {
  try {
    const { product_name, notify, status, rating, page } = req.body;
    const limit = 8;
    const filters: { [key: string]: any } = {};
    if (product_name !== undefined)
      filters["product_name"] = new RegExp(product_name);
    if (notify !== undefined) filters["notify"] = notify;
    if (status !== undefined) filters["status"] = status;
    if (rating !== undefined) filters["rating"] = Number(rating);
    const reviews = await reviewModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).send({
      reviews,
    });
  } catch (err) {
    logger.error("fetch review error " + err);
    return res
      .status(500)
      .send({ message: "something went wrong", type: "info" });
  }
};

export default handleGetReviewFilters;
