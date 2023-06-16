import { Request, Response } from "express";
import fs from "fs";
import categoryModel from "../../model/category.model";

const deleteCategoryImage = async (req: Request, res: Response) => {
  const imagePath = req.body.imagePath;
  const categoryAlreadyExists = await categoryModel.findOne({
    _id: req.query._id,
  });

  if (categoryAlreadyExists) {
    categoryAlreadyExists.Image = "";
    const category = await categoryAlreadyExists.save({
      validateBeforeSave: false,
    });
    // fs.unlinkSync(imagePath);
    res.status(200).json({
      type: "success",
      message: "category image deleted successfully",
      category,
    });
  } else {
    res.status(500).json({
      type: "error",
      message: "category does not exist",
    });
  }
};

export default deleteCategoryImage;
