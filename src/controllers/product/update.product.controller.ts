import { Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { ReqProductObject } from "../../schema/product.schema";
import { TokenPayload } from "../../utils/jwt.utils";

const updateProduct = async (
  req: Request<{}, {}, ReqProductObject & TokenPayload>,
  res: Response
) => {
  const productAlreadyExists = await ProductModel.findOne({
    name: req.query.name,
  });

  if (productAlreadyExists) {
    const newProduct = await ProductModel.findOneAndUpdate(
      { name: req.query.name },
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
      newProduct,
    });
  } else {
    res.status(500).json({
      message: "product does not exist",
    });
  }
};

export default updateProduct;
