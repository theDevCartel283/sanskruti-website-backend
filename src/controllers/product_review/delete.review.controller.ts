import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { productRatingModel, reviewModel } from "../../model/review.model";
import { TokenPayload } from "../../utils/jwt.utils";

const handleDeleteReview = async (
  req: Request<{ id: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userUniqueIdentity } = req.body;
    const review = await reviewModel.findOne({
      product_id: id,
      id: userUniqueIdentity.toString(),
    });
    let productRating = await productRatingModel.findOne({ product_id: id });
    if (!review) {
      return res.status(200).send({
        message: "review successfully deleted",
        type: "success",
      });
    }
    if (productRating) {
      productRating.ratingCounts[review.rating] -= 1;
      productRating.totalRatings -= 1;
    }

    await reviewModel.deleteOne({
      product_id: id,
      id: userUniqueIdentity.toString(),
    });
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
