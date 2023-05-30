import { Request, Response } from "express";
import categoryModel from "../../model/category.model";

const addCategoryImage = async (req: Request, res: Response) => {
  const imagePath: any = req.body.imagePath;
  console.log(imagePath);
  const categoryAlreadyExists = await categoryModel.findOne({
    _id: req.query._id,
  });

  if (categoryAlreadyExists) {
    categoryAlreadyExists.Image = imagePath;
    const category = await categoryAlreadyExists.save({
      validateBeforeSave: false,
    });
    res.status(200).json({
      type: "success",
      message: "category image uploaded successfully",
      category,
    });
  } else {
    res.status(500).json({
      type: "error",
      message: "category does not exist",
    });
  }
};

export default addCategoryImage;
