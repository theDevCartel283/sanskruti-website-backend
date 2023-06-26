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
  console.log(req.body);

  if (Category) {
    res.status(200).json({
      type: "error",
      message: "Category already exists !",
    });
  } else {
    const newCategory = new categoryModel({
      Title: req.body.Title.trim().toLowerCase(),
      Meta_Title: req.body.Meta_Title,
      Meta_Description: req.body.Meta_Description,
      Image: req.body.Image || "",
    });

    const category = await newCategory.save();
    let _id = category._id;

    res.status(200).json({
      type: "success",
      _id,
      message: "Category Added",
    });
  }
};

export default addCategory;
