import { NextFunction, Request, Response } from "express";
import ProductModel from "../../model/product.model";
import { Roles } from "../../config/roles.config";
import ErrorHandler from "../../utils/errorHandler.utils";

const getproductDetails = async (
  req: Request<{}, {}, {}, { slug: string }>,
  res: Response,
  next: NextFunction
) => {
  const productAlreadyExists = await ProductModel.findOne({
    slug: req.query.slug,
  });

  // const arr = {
  //   size: req.body.size,
  //   color: req.body.color,
  //   stock: req.body.stock,
  //   price: req.body.price,
  // };

  if (productAlreadyExists) {
    res.status(200).json({
      success: true,
      productAlreadyExists,
    });
  } else {
    return next(new ErrorHandler("product not found", "error", 404));
  }
};

export default getproductDetails;
