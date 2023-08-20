import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import fs from "fs";
import subCategoryModel from "../../model/subCategory.model";
import axios from "axios";

const deleteCategory = async (req: Request, res: Response) => {
  const id: any = req.query.id;
  if (id.length == 24) {
    const category: any = await categoryModel.findById(id);

    if (!category) {
      return res.status(500).json({
        type: "error",
        message: "category not found",
      });
    } else {
      await subCategoryModel.deleteMany({
        Category: category.Title,
      });
      const url = category.Image;
      const name = url.split(`${process.env.CDN_ENDPOINT}/`)[1];
      if (url !== "") {
        const response = await axios.delete(
          `${process.env.CDN_ENDPOINT}/cdn/v1/images/deleteImage?name=${name}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      await category.deleteOne(req.query);
      res.status(200).json({
        type: "success",
        message: "category Deleted Successfully",
      });
    }
  } else {
    res.status(500).json({
      type: "warning",
      message: "wrong id / id length should be of 24 char",
    });
  }
};

export default deleteCategory;
