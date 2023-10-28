import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import varientModel from "../../model/varients.model";

const handleGetVarientFromId = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const varient = await varientModel.findById(id);

    if (!varient)
      return res
        .status(404)
        .send({ message: "varient not found", type: "error" });

    res.status(200).send({
      varient,
    });
  } catch (err) {
    logger.error("handle get variant from id " + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetVarientFromId;
