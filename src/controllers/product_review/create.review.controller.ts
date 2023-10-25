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

    await userReview.save();

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
