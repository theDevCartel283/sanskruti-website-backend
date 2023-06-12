import { Request, Response } from "express";
import subCategoryModel from "../../model/subCategory.model";

const getSubCategory = async (req: Request, res: Response) => {
  const id: any = req.query.id;
  const subCategory: any = await subCategoryModel.findById({ _id: id });

  if (!subCategory) {
    return res.status(500).json({
      type: "error",
      message: "subCategory not found",
    });
  } else {
    const subCategory = await subCategoryModel.findById({ _id: id });
    res.status(200).json({
      type: "success",
      subCategory,
    });
  }
};

export default getSubCategory;
