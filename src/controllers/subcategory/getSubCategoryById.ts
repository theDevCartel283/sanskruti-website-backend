import { Request, Response } from "express";
import logger from "../../utils/logger.utils";
import subCategoryModel from "../../model/subCategory.model";

const handleGetSubCategoryById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById(id);

    if (!subCategory) {
      return res
        .status(404)
        .send({ message: "category not found", type: "error" });
    }

    return res.status(200).send({
      subCategory,
    });
  } catch (err) {
    logger.error("handle get sub category error" + err);
    res.status(500).send({
      message: "something went wrong",
      type: "error",
    });
  }
};

export default handleGetSubCategoryById;
