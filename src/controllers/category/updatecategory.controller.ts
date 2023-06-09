import { Request, Response } from "express";
import categoryModel from "../../model/category.model";

const updateCategory = async (req: Request, res: Response) => {
  const id: any = req.query.id;

  const category = await categoryModel.findById(id);
  if (!category) {
    return res.status(500).json({
      type: "error",
      message: "category not found",
    });
  } else {
    const duplicateCategory = await categoryModel.findOne({
      Title: req.body.Title,
    });
    if (duplicateCategory) {
      if (req.body.Title !== category.Title) {
        res.status(200).json({
          type: "warning",
          message: "category already exists !",
        });
      } else {
        const newCategory = await categoryModel.findByIdAndUpdate(
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
          message: "category updated successfully",
        });
      }
    } else {
      const newCategory = await categoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      res.status(200).json({
        type: "success",
        message: "category updated successfully",
      });
    }
  }
};

export default updateCategory;
