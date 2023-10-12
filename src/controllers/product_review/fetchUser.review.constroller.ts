import { Request, Response } from "express";
import { ProductRating, reviewModel } from "../../model/review.model";
import logger from "../../utils/logger.utils";
import { TokenPayload } from "../../utils/jwt.utils";

const handleFetchUsersReview = async (
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
    res.status(200).send({
      userReview: review,
    });
  } catch (err) {
    logger.error("fetch review error " + err);
    return res
      .status(500)
      .send({ message: "something went wrong", type: "info" });
  }
};

export default handleFetchUsersReview;
