import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { Roles } from "../../config/roles.config";
import { TokenPayload } from "../../utils/jwt.utils";

const deleteProduct = async (req: Request<TokenPayload>, res: Response) => {
  const productAlreadyExists = await ProductModel.findOne({
    name: req.query.name,
  });

  if (productAlreadyExists) {
    await ProductModel.deleteOne(req.query);
    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } else {
    res.status(500).json({
      message: "product does not exist",
    });
  }
};

export default deleteProduct;
