import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { reviewModel, productRatingModel } from "../../model/review.model";

const handleReviewFetch = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const reviews = await reviewModel.find({ product_id: id });
    let productRating = await productRatingModel.findOne({ product_id: id });
    if (!productRating) {
      productRating = new productRatingModel({
        product_id: id,
        totalRatings: 0,
        ratings: [],
        ratingCounts: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      });
    }
    let filteredReviews =
      reviews.filter((review) => review.status === "Accepted") || [];
    res.status(200).send({
      reviews: {
        ...productRating,
        reviews: filteredReviews,
      },
    });
  } catch (err) {
    logger.error("fetch review error " + err);
    return res
      .status(500)
      .send({ message: "something went wrong", type: "info" });
  }
};

export default handleReviewFetch;
