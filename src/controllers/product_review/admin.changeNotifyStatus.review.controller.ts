import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import { reviewModel } from "../../model/review.model";

const handleAdminNotifyStatus = async (
  req: Request<{}, {}, { id: string; notify: boolean }>,
  res: Response
) => {
  try {
    const { notify, id } = req.body;
    const review = await reviewModel.findById(id);

    if (!review)
      return res
        .status(404)
        .send({ message: "review not found", type: "error" });

    review.notify = notify;
    review.save();

    return res.status(200).send({
      message: notify ? "review pinned" : "review unpinned",
      type: "success",
    });
  } catch (err) {
    logger.error("handle admin notigy status error " + err);
    return res
      .status(500)
      .send({ message: "something went wrong", type: "error" });
  }
};

export default handleAdminNotifyStatus;
