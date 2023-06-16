import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { Roles } from "../../config/roles.config";
import { TokenPayload } from "../../utils/jwt.utils";
import fs from "fs";

const deleteProduct = async (req: Request<TokenPayload>, res: Response) => {
  const productAlreadyExists = await ProductModel.findOne({
    _id: req.query.id,
  });

  if (productAlreadyExists) {
    await ProductModel.deleteOne({ _id: req.query.id });
    res.status(200).json({
      type: "success",
      message: "product deleted successfully",
    });
  } else {
    res.status(500).json({
      type: "error",
      message: "product does not exist",
    });
  }
};

export default deleteProduct;
