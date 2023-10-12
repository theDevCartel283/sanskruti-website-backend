import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { Reviews, reviewModel } from "../../model/review.model";

const handleAdminUpdateReviewStatus = async (
  req: Request<{}, {}, { status: Reviews["status"]; id: string }>,
  res: Response
) => {
  try {
    const { id, status } = req.body;
    const review = await reviewModel.findById(id);

    if (!review)
      return res
        .status(404)
        .send({ message: "review not found", type: "error" });

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
