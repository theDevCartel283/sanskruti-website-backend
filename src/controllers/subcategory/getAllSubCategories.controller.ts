import { Request, Response } from "express";
import ApiFeatures from "../../utils/apiFeatures.utils";
import subCategoryModel from "../../model/subCategory.model";

const getAllSubCategories = async (req: Request, res: Response) => {
  const subCategoriesCount: number = await subCategoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(subCategoryModel.find(), req.query)
    .searchForSubCategory()
    .filter();
  const subCategories = await apiFeatures.query;
  if (!subCategories) {
    res.status(401).json({
      type: "success",
      message: "no categories found",
    });
  } else {
    res.status(200).json({
      type: "success",
      subCategories,
      subCategoriesCount,
    });
  }
};

export default getAllSubCategories;
