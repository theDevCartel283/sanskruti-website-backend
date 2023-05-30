import { Request, Response } from "express";
import categoryModel from "../../model/category.model";

const updateCategory = async (req: Request, res: Response) => {
  const id: any = req.query.id;
  if (id.length == 24) {
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(500).json({
        type: "error",
        message: "category not found",
      });
    } else {
      const newCategory = await categoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      console.log(newCategory);
      res.status(200).json({
        type: "success",
        newCategory,
      });
    }
  } else {
    res.status(500).json({
      type: "warning",
      message: "wrong id / id length should be of 24 char",
    });
  }
};

export default updateCategory;
