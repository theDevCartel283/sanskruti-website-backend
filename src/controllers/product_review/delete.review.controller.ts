import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import reviewModel from "../../model/review.model";
import { TokenPayload } from "../../utils/jwt.utils";

const handleDeleteReview = async (
  req: Request<{ id: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userUniqueIdentity } = req.body;
    const reviews = await reviewModel.findOne({ product_id: id });
    if (!reviews) {
      return res.status(200).send({
        message: "review successfully deleted",
        type: "success",
      });
    }
    reviews.reviews = reviews.reviews.filter((review) => {
      if (review.id === userUniqueIdentity.toString()) {
        reviews.ratingCounts[review.rating] -= 1;
        reviews.totalRatings -= 1;
      }
      return review.id !== userUniqueIdentity.toString();
    });
    await reviews.save();
    return res.status(200).send({
      message: "Review successfully deleted",
      type: "success",
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
