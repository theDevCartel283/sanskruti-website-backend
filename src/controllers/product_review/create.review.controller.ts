import { Request, Response } from "express";
import { ReqReviewObject } from "../../schema/review.schema";
import logger from "../../utils/logger.utils";
import {
  ReviewDocument,
  Reviews,
  productRatingModel,
  reviewModel,
} from "../../model/review.model";
import { TokenPayload } from "../../utils/jwt.utils";
import ProductModel from "../../model/product.model";

const handleCreateReview = async (
  req: Request<{}, {}, ReqReviewObject & TokenPayload>,
  res: Response
) => {
  const { product_id, comment, rating, title, username, userUniqueIdentity } =
    req.body;

  try {
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
    const product = await ProductModel.findById(product_id);
    const userReview = new reviewModel({
      id: userUniqueIdentity.toString(),
      product_id,
      product_name: product?.name || "undefined",
      product_image: product?.images[0] || "undefined",
      status: "Under review",
      username,
      title,
      rating,
      comment,
      notify: true,
    });

    productRating.ratingCounts[rating] += 1;
    productRating.totalRatings += 1;

    await userReview.save();
    await productRating.save();

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
