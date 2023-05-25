import express, { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import { ReqCategoryObject } from "../../schema/category.schema";

const addCategory = async (
  req: Request<{}, {}, ReqCategoryObject>,
  res: Response
) => {
  const Category = await categoryModel.findOne({
    name: req.body.name,
  });

  const sub_Category: string = req.body.subCategory.toLowerCase();

  const arr: Array<string> = [sub_Category];

  if (Category) {
    Category.subCategory = Category.subCategory.filter(
      (item, key) => item != sub_Category
    );
    Category.subCategory.push(sub_Category);

    await Category.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      Category,
    });
  } else {
    const newCategory = new categoryModel({
      name: req.body.name.toLowerCase(),
      subCategory: arr,
    });

    const category = await newCategory.save();

    res.status(200).json({
      success: true,
      category,
    });
  }
};

export default addCategory;
