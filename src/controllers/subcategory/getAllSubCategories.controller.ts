import { Request, Response } from "express";
import subCategoryModel from "../../model/subCategory.model";

const getAllSubCategories = async (req: Request, res: Response) => {
  const subCategories = await subCategoryModel.find();
  if (!subCategories) {
    res.status(401).json({
      type: "success",
      message: "no subCategories found",
    });
  } else {
    res.status(200).json({
      type: "success",
      subCategories,
    });
  }
};

export default getAllSubCategories;
