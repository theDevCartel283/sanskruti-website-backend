import { Request, Response } from "express";
import subCategoryModel from "../../model/subCategory.model";

const deleteSubCategory = async (req: Request, res: Response) => {
  const id: any = req.query.id;
  const subCategory: any = await subCategoryModel.findById(id);

  if (!subCategory) {
    return res.status(500).json({
      type: "error",
      message: "subCategory not found",
    });
  } else {
    await subCategoryModel.findByIdAndDelete({ _id: req.query.id });
    res.status(200).json({
      type: "success",
      message: "subCategory Deleted Successfully",
    });
  }
};

export default deleteSubCategory;
