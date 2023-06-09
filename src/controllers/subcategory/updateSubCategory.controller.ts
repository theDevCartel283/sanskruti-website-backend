import { Request, Response } from "express";
import subCategoryModel from "../../model/subCategory.model";

const updateSubCategory = async (req: Request, res: Response) => {
  const id: any = req.query.id;

  const subCategory = await subCategoryModel.findById(id);
  if (!subCategory) {
    return res.status(500).json({
      type: "error",
      message: "category not found",
    });
  } else {
    const duplicateSubCategory = await subCategoryModel.find({
      Category: req.body.Category,
    });
    let isExist = false;
    duplicateSubCategory.forEach((i) => {
      if (i.Title === req.body.Title && i.Category === req.body.Category) {
        isExist = true;
      }
    });

    if (isExist) {
      if (
        req.body.Title === subCategory.Title &&
        req.body.Category === subCategory.Category
      ) {
        const newCategory = await subCategoryModel.findByIdAndUpdate(
          id,
          req.body,
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
        res.status(200).json({
          type: "success",
          message: "subCategory updated successfully",
        });
      } else {
        res.status(200).json({
          type: "warning",
          message: "subcategory already exists !",
        });
      }
    } else {
      const newSubCategory = await subCategoryModel.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      res.status(200).json({
        type: "success",
        message: "subCategory updated successfully",
      });
    }
  }
};

export default updateSubCategory;
