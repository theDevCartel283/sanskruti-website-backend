import { Request, Response } from "express";
import { reviewModel, productRatingModel } from "../../model/review.model";
import { ReqReviewObject } from "../../schema/review.schema";
import logger from "../../utils/logger.utils";
import handleCreateReview from "./create.review.controller";
import { TokenPayload } from "../../utils/jwt.utils";

const updateReview = async (
  req: Request<{}, {}, ReqReviewObject & TokenPayload>,
  res: Response
) => {
  const { product_id, username, title, comment, rating, userUniqueIdentity } =
    req.body;
  try {
    const review = await reviewModel.findOne({
      product_id,
      id: userUniqueIdentity.toString(),
    });
    let productRating = await productRatingModel.findOne({ product_id });
    if (!productRating) {
      productRating = new productRatingModel({
        product_id,
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

    if (!review) {
      return handleCreateReview(req, res);
    }
    if (productRating) {
      if (productRating.ratingCounts[review.rating] - 1 >= 0)
        productRating.ratingCounts[review.rating] -= 1;
    }
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.status = "Under review";
    review.notify = true;
    await review.save();

    await productRating.save();
    res.status(200).send({
      userReview: {
        id: userUniqueIdentity.toString(),
        username,
        title,
        rating,
        comment,
      },
      message: "Review updated!!",
      content: "Your product review is currently under review",
      type: "success",
    });
  } catch (err) {
    logger.error("update review error " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};
export default updateReview;
