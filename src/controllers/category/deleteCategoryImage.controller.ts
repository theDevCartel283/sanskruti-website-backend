import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import categoryModel from "../../model/category.model";

const deleteCategoryImage = async (req: Request, res: Response) => {
  const categoryAlreadyExists = await categoryModel.findOne({
    _id: req.query._id,
  });
  console.log(req.query);
  const url_params = req.query;
  const response = await axios.delete(
    `${process.env.CDN_ENDPOINT}/cdn/v1/images/deleteImage?name=${url_params.name}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = response.data;

  if (categoryAlreadyExists) {
    categoryAlreadyExists.Image = "";
    const category = await categoryAlreadyExists.save({
      validateBeforeSave: false,
    });
    res.status(200).json({
      type: "success",
      message: "category image deleted successfully",
      // category,
    });
  } else {
    res.status(500).json({
      type: "error",
      message: "category does not exist",
    });
  }
};

export default deleteCategoryImage;
