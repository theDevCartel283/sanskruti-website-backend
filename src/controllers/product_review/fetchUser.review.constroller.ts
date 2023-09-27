import { Request, Response } from "express";
import reviewModel, { ProductRating } from "../../model/review.model";
import logger from "../../utils/logger.utils";
import { TokenPayload } from "../../utils/jwt.utils";

const handleFetchUsersReview = async (
  req: Request<{ id: string }, {}, TokenPayload>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { userUniqueIdentity } = req.body;

    const reviews = await reviewModel.findOne({ product_id: id });
    const userReview = reviews?.reviews.find(
      (review) => review.id == userUniqueIdentity.toString()
    );
    res.status(200).send({
      userReview,
    });
  } catch (err) {
    logger.error("fetch review error " + err);
    return res
      .status(500)
      .send({ message: "something went wrong", type: "info" });
  }
};

export default handleFetchUsersReview;
