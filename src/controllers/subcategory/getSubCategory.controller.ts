import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import ApiFeatures from "../../utils/apiFeatures.utils";

const getSubCategory = async (req: Request, res: Response) => {
  const resultperpage: number = 8;
  const subCategoryCount: number = await categoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .search()
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
      subCategoryCount,
    });
  }
};

export default getSubCategory;
