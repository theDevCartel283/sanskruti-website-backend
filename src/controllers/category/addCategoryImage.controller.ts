import { Request, Response } from "express";
import categoryModel from "../../model/category.model";

const addCategoryImage = async (req: Request, res: Response) => {
  const imagePath: any = req.body.Image;
  const categoryAlreadyExists = await categoryModel.findOne({
    _id: req.query._id,
  });
  console.log(req.body);

  if (categoryAlreadyExists) {
    if (categoryAlreadyExists.Image === null) {
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
      await categoryModel.updateOne(
        { _id: req.query._id },
        {
          $set: {
            Image: req.body.image,
          },
        }
      );
      res.status(200).json({
        type: "success",
        message: "Category image  updated successfully",
      });
    }
  } else {
    res.status(500).json({
      type: "error",
      message: "category does not exist",
    });
  }
};

export default addCategoryImage;
