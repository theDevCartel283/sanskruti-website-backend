import { Request, Response } from "express";
import subCategoryModel from "../../model/subCategory.model";
import { ReqSubCategoryObject } from "../../schema/subcategory.schema";
const addSubCategory = async (
  req: Request<{}, {}, ReqSubCategoryObject>,
  res: Response
) => {
  const subCategory = await subCategoryModel.findOne({ Title: req.body.Title });

  if (subCategory?.Category === req.body.Category) {
    res.status(502).json({
      type: "warning",
      message: "subCategory already exists!",
    });
  } else {
    const newSubCategory = new subCategoryModel({
      Title: req.body.Title.trim().toLowerCase(),
      Slug: req.body.Slug,
      Category: req.body.Category,
      Meta_Title: req.body.Meta_Title,
      Meta_Description: req.body.Meta_Description,
    });

    const subCategory = await newSubCategory.save();
    res.status(200).json({
      type: "success",
      subCategory,
      message: "subCategory added successfully",
    });
  }
};

export default addSubCategory;
