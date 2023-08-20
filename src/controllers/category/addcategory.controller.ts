import { Request, Response } from "express";
import axios from "axios";
import categoryModel from "../../model/category.model";
import { ReqCategoryObject } from "../../schema/category.schema";

const addCategory = async (
  req: Request<{}, {}, ReqCategoryObject>,
  res: Response
) => {
  const Category = await categoryModel.findOne({
    Title: req.body.Title,
  });
  const temp = {
    image: req.body.Image.split(",")[1],
    imageName: req.body.imageName,
  };

  if (Category) {
    res.status(200).json({
      type: "error",
      message: "Category already exists !",
    });
  } else {
    const response = await axios.post(
      `${process.env.CDN_ENDPOINT}/cdn/v1/images/takeImages`,
      temp,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    console.log(data);
    const newCategory = new categoryModel({
      Title: req.body.Title.trim().toLowerCase(),
      Meta_Title: req.body.Meta_Title,
      Meta_Description: req.body.Meta_Description,
      Image: data.path || "",
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
