import { Request, Response } from "express";
import reviewModel from "../../model/review.model";
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
    const reviews = await reviewModel.findOne({ product_id });

    if (!reviews) {
      return handleCreateReview(req, res);
    }

    reviews.reviews.map((rev) => {
      if (rev.id === userUniqueIdentity.toString()) {
        reviews.ratingCounts[rev.rating] -= 1;
        reviews.ratingCounts[rating] += 1;
        rev.rating = rating;
        rev.title = title;
        rev.comment = comment;
      }
    });

    await reviews.save();
    res.status(200).send({
      userReview: {
        id: userUniqueIdentity.toString(),
        username,
        title,
        rating,
        comment,
      },
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
