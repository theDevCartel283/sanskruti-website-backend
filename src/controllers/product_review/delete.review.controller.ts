import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import reviewModel from "../../model/review.model";

const handleDeleteReview = async (
  req: Request<{ id: string }, {}, {}, { userId: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const reviews = await reviewModel.findOne({ product_id: id });
    if (!reviews) {
      return res.status(200).send({
        message: "review successfully deleted",
        type: "success",
      });
    }
    reviews.reviews = reviews.reviews.filter((review) => {
      if (review.id === userId) {
        reviews.ratingCounts[review.rating] -= 1;
        reviews.totalRatings -= 1;
      }
      return review.id !== userId;
    });
    await reviews.save();
    return res.status(200).send({
      message: "review successfully deleted",
      type: "success",
      reviews,
    });
  } catch (err) {
    logger.error("delete review error " + err);
    return res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export default handleDeleteReview;
