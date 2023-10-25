import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import {
  Reviews,
  productRatingModel,
  reviewModel,
} from "../../model/review.model";

const handleAdminUpdateReviewStatus = async (
  req: Request<{}, {}, { status: Reviews["status"]; id: string }>,
  res: Response
) => {
  try {
    const { id, status } = req.body;
    const review = await reviewModel.findById(id);

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

    if (!review)
      return res
        .status(404)
        .send({ message: "review not found", type: "error" });

    if (status === "Accepted" && review?.status !== "Accepted") {
      productRating.ratingCounts[review.rating] += 1;
      productRating.totalRatings += 1;
    }

    if (status === "Denied" && review.status === "Accepted") {
      productRating.ratingCounts[review.rating] -= 1;
      productRating.totalRatings -= 1;
    }

    review.status = status;

    await review.save();
    return res
      .status(200)
      .send({ message: "review status modified", type: "success" });
  } catch (err) {
    logger.error("handle admin review status update error " + err);
    return res
      .status(500)
      .send({ message: "something went wrong", type: "error" });
  }
};

export default handleAdminUpdateReviewStatus;
