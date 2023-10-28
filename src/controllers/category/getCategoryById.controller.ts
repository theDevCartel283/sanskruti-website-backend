import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import categoryModel from "../../model/category.model";

const handleGetCategoryFromId = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    if (!category) {
      res.status(404).send({ message: "category not found", type: "error" });
    }

    return res.status(200).send({
      category,
    });
  } catch (err) {
    logger.error("handle get catogory from id error" + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetCategoryFromId;
