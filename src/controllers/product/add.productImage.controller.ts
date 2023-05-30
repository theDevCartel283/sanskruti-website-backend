import { Request, Response } from "express";
import ProductModel from "../../model/product.model";

const addProductImages = async (req: Request, res: Response) => {
  const imagePathArray: any = req.body.imagePathArray;
  console.log(imagePathArray);
  const productAlreadyExists = await ProductModel.findOne({
    _id: req.query._id,
  });

  if (productAlreadyExists) {
    imagePathArray.map((item: any) => {
      let isExist = false;
      productAlreadyExists.images.map((i) => {
        if (i === item) {
          isExist = true;
        }
      });
      if (isExist === false) {
        productAlreadyExists.images.push(item);
      }
    });
    const product = await productAlreadyExists.save({
      validateBeforeSave: false,
    });
    res.status(200).json({
      success: true,
      message: "product images uploaded successfully",
      product,
    });
  } else {
    res.status(500).json({
      message: "product does not exist",
    });
  }
};

export default addProductImages;
