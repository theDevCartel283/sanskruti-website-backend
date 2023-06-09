import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import ApiFeatures from "../../utils/apiFeatures.utils";

const getCategory = async (req: Request, res: Response) => {
  const resultperpage: number = 8;
  const categoryCount: number = await categoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .search()
    .filter();
  const categories = await apiFeatures.query;
  if (!categories) {
    res.status(401).json({
      type: "success",
      message: "no categories found",
    });
  } else {
    res.status(200).json({
      type: "success",
      categories,
      categoryCount,
    });
  }
};

export default getCategory;
