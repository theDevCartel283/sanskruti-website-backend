import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import fs from "fs";

const deleteProductImages = async (req: Request, res: Response) => {
  const imagePath = req.body.imagePath;
  const productAlreadyExists = await ProductModel.findOne({
    _id: req.query._id,
  });

  const arr: Array<object> = [];

  if (productAlreadyExists) {
    productAlreadyExists.images = productAlreadyExists.images.filter(
      (item: any) => item !== imagePath
    );
    const product = await productAlreadyExists.save({
      validateBeforeSave: false,
    });
    // fs.unlinkSync(imagePath);
    res.status(200).json({
      success: true,
      message: "product images deleted successfully",
      product,
    });
  } else {
    res.status(500).json({
      message: "product does not exist",
    });
  }
};

export default deleteProductImages;
