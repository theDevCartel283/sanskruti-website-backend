import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import reviewModel from "../../model/review.model";

const handleReviewFetch = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const reviews = await reviewModel.findOne({ product_id: id });
    if (reviews) {
      reviews.reviews =
        reviews?.reviews.filter((review) => review.status === "Accepted") || [];
    }
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

export default handleReviewFetch;
