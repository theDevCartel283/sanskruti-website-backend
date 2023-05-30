import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import { ReqCategoryObject } from "../../schema/category.schema";

const addCategory = async (
  req: Request<{}, {}, ReqCategoryObject>,
  res: Response
) => {
  const Category = await categoryModel.findOne({
    Title: req.body.Title,
  });

  if (Category) {
    res.status(200).json({
      type: "error",
      message: "Category already exists !",
    });
  } else {
    const newCategory = new categoryModel({
      Title: req.body.Title.trim().toLowerCase(),
      Slug: req.body.Slug,
      Meta_Title: req.body.Meta_Title,
      Meta_Description: req.body.Meta_Description,
    });

    const category = await newCategory.save();

    res.status(200).json({
      type: "success",
      category,
    });
  }
};

export default addCategory;
