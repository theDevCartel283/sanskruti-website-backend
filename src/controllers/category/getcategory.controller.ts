import { Request, Response } from "express";
import categoryModel from "../../model/category.model";

const getCategory = async (req: Request, res: Response) => {
  const categories = await categoryModel.find();
  if (!categories) {
    res.status(401).json({
      type: "success",
      message: "no categories found",
    });
  } else {
    res.status(200).json({
      type: "success",
      categories,
    });
  }
};

export default getCategory;
