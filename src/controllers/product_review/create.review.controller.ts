import { Request, Response } from "express";
import { ReqReviewObject } from "../../schema/review.schema";
import logger from "../../utils/logger.utils";
import reviewModel, { Reviews } from "../../model/review.model";
import { TokenPayload } from "../../utils/jwt.utils";

const handleCreateReview = async (
  req: Request<{}, {}, ReqReviewObject & TokenPayload>,
  res: Response
) => {
  const { product_id, comment, rating, title, username, userUniqueIdentity } =
    req.body;

  try {
    let reviews = await reviewModel.findOne({ product_id });
    if (!reviews) {
      reviews = new reviewModel({
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
    const userReview: Reviews = {
      id: userUniqueIdentity.toString(),
      status: "Under review",
      username,
      title,
      rating,
      comment,
    };
    reviews.reviews.push(userReview);

    reviews.ratingCounts[rating] += 1;
    reviews.totalRatings += 1;

    await reviews.save();

    res.status(200).send({
      userReview,
      message: "Review posted!!",
      content: "Your product review is currently under review",
      type: "success",
    });
  } catch (err) {
    logger.error("create review error " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "info",
    });
  }
};

export default handleCreateReview;
