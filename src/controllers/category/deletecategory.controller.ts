import { Request, Response } from "express";
import categoryModel from "../../model/category.model";
import fs from "fs";

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
      fs.unlinkSync(category.Image);
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
